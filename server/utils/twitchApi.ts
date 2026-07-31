import { $fetch } from 'ofetch'

/** Refresh the token this long before it actually expires. */
const EXPIRY_BUFFER = 5 * 60 * 1000

async function getAccessToken(): Promise<string> {
  const { twitchClientId, twitchClientSecret } = useRuntimeConfig()
  const storage = useStorage('twitch')

  const storedToken = await storage.getItem<StoredToken>('token')

  if (storedToken && storedToken.expires_at > Date.now() + EXPIRY_BUFFER)
    return storedToken.access_token

  const newToken = await $fetch<AccessToken>('https://id.twitch.tv/oauth2/token', {
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

  await storage.setItem<StoredToken>('token', {
    ...newToken,
    expires_at: Date.now() + newToken.expires_in * 1000,
  })

  return newToken.access_token
}

/**
 * GET from the Twitch Helix API using a cached app access token.
 *
 * Runtime config is read per request rather than at module scope, so env-based
 * overrides are picked up and secrets are not captured at import time.
 */
export default async function twitchApi<T>(request: string): Promise<T> {
  const { twitchApiBaseUrl, twitchClientId } = useRuntimeConfig()

  try {
    const accessToken = await getAccessToken()

    return await $fetch<T>(request, {
      baseURL: twitchApiBaseUrl,
      headers: {
        'Client-ID': twitchClientId,
        'Authorization': `Bearer ${accessToken}`,
      },
    })
  }
  catch (error) {
    console.error('Twitch API request failed:', error)
    throw error
  }
}
