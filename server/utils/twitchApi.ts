import { $fetch } from 'ofetch'

const { twitchApiBaseUrl, twitchClientId, twitchClientSecret } = useRuntimeConfig()

async function getAuthToken() {
  return await $fetch<AccessToken>(`https://id.twitch.tv/oauth2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: twitchClientId,
      client_secret: twitchClientSecret,
      grant_type: 'client_credentials',
    }),
  })
}

export default $fetch.create({
  baseURL: twitchApiBaseUrl,
  headers: {
    'Client-ID': twitchClientId,
  },
  async onRequest({ options }) {
    let storedToken = await useStorage('twitch').getItem<StoredToken>('token')

    if (!storedToken || storedToken.expires_at <= Date.now()) {
      const newToken = await getAuthToken()

      storedToken = {
        ...newToken,
        expires_at: Date.now() + (newToken.expires_in * 1000), // Convert to milliseconds
      }

      await useStorage('twitch').setItem('token', storedToken)
    }

    options.headers.set('authorization', `Bearer ${storedToken.access_token}`)
  },
})
