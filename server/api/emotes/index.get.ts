export default defineCachedEventHandler(async () => {
  try {
    const twitchEmotesPromise = $fetch('/api/emotes/twitch', {
      method: 'GET',
    })
    const bttvEmotesPromise = $fetch('/api/emotes/bttv', {
      method: 'GET',
    })

    const [twitchEmotes, bttvEmotes] = await Promise.all([
      twitchEmotesPromise,
      bttvEmotesPromise,
    ])

    const emotes: Emote[] = []

    twitchEmotes.forEach((emote) => {
      emotes.push({
        code: emote.name,
        urls: [
          {
            size: '1x',
            url: emote.images.url_1x,
          },
          {
            size: '2x',
            url: emote.images.url_2x,
          },
          {
            size: '4x',
            url: emote.images.url_4x,
          },
        ],
      })
    })

    bttvEmotes.forEach((emote) => {
      emotes.push({
        code: emote.code,
        urls: [
          {
            size: '1x',
            url: `https://cdn.betterttv.net/emote/${emote.id}/1x.${emote.imageType}`,
          },
          {
            size: '2x',
            url: `https://cdn.betterttv.net/emote/${emote.id}/2x.${emote.imageType}`,
          },
          {
            size: '3x',
            url: `https://cdn.betterttv.net/emote/${emote.id}/3x.${emote.imageType}`,
          },
        ],
      })
    })

    return emotes
  }
  catch (error) {
    console.error(error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch emotes',
      data: error,
    })
  }
}, {
  maxAge: 60 * 60 * 24, // 24 hours
})
