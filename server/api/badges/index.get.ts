export default defineCachedEventHandler(async (event) => {
  const { twitchId } = useRuntimeConfig(event).public

  try {
    const globalBadgesPromise = twitchApi<BadgesResponse>('chat/badges/global')

    const channelBadgesPromise = twitchApi<BadgesResponse>(`chat/badges?broadcaster_id=${twitchId}`)

    const [globalBadges, channelBadges] = await Promise.all([
      globalBadgesPromise,
      channelBadgesPromise,
    ])

    return [...globalBadges.data, ...channelBadges.data]
  }
  catch (error) {
    console.error(error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch badges',
    })
  }
}, {
  maxAge: 60 * 60 * 24, // 24 hours
})
