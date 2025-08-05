export default defineEventHandler(async () => {
  const { twitchId } = useRuntimeConfig().public

  try {
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
  }
  catch (error) {
    console.error(error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch twitch emotes',
    })
  }
})
