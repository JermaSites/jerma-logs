import { $fetch } from 'ofetch'

const { twitchApiBaseUrl, twitchClientId, twitchClientSecret }
  = useRuntimeConfig()

interface AccessToken {
  access_token: string
  expires_in: number
  token_type: string
}

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
  async onRequest({ options }: any) {
    let token = await useStorage('twitch').getItem<AccessToken>('token')

    if (!token || token.expires_in <= Date.now()) {
      token = await getAuthToken()
      token.expires_in += Date.now()
      await useStorage('twitch').setItem<AccessToken>('token', token)
    }

    options.headers.authorization = `Bearer ${token.access_token}`
  },
})
