export default defineEventHandler(async () => {
  const { twitchId } = useRuntimeConfig().public

  try {
    const userPromise = $fetch<UserBttvResponse>(
      `https://api.betterttv.net/3/cached/users/twitch/${twitchId}`,
      {
        method: 'GET',
      },
    )

    const globalEmotesPromise = $fetch<BttvEmote[]>(
      `https://api.betterttv.net/3/cached/emotes/global`,
      {
        method: 'GET',
      },
    )

    const [user, globalEmotes] = await Promise.all([
      userPromise,
      globalEmotesPromise,
    ])

    return [...globalEmotes, ...user.channelEmotes, ...user.sharedEmotes]
  }
  catch (error) {
    console.error(error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch bttv emotes',
    })
  }
})
