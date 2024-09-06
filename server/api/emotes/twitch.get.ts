import type { ChannelEmotesResponse, GlobalEmotesResponse } from '@/types'
import twitchApi from '../../utils/twitch'

export default cachedEventHandler(
  async () => {
    const { twitchId } = useRuntimeConfig().public

    const channelEmotesPromise = twitchApi<ChannelEmotesResponse>(
      `chat/emotes?broadcaster_id=${twitchId}`,
      {
        method: 'GET',
      },
    )

    const globalEmotesPromise = twitchApi<GlobalEmotesResponse>(
      'chat/emotes/global',
      {
        method: 'GET',
      },
    )

    const [channelEmotes, globalEmotes] = await Promise.all([
      channelEmotesPromise,
      globalEmotesPromise,
    ])

    return [...channelEmotes.data, ...globalEmotes.data]
  },
  {
    maxAge: 60 * 60 * 24,
  },
)
