export default defineCachedEventHandler(async () => {
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

    const combinedEmotes = [...channelEmotes.data, ...globalEmotes.data]

    // Fix for animated emotes
    combinedEmotes.forEach((emote) => {
      emote.images = {
        url_1x: emote.images.url_1x.replace('/static/', '/default/'),
        url_2x: emote.images.url_2x.replace('/static/', '/default/'),
        url_4x: emote.images.url_4x.replace('/static/', '/default/'),
      }
    })

    return combinedEmotes
  }
  catch (error) {
    console.error(error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch twitch emotes',
      data: error,
    })
  }
}, {
  maxAge: 60 * 60 * 24, // 24 hours
})
