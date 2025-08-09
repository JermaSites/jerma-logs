export default defineEventHandler(async () => {
  const { twitchId } = useRuntimeConfig().public

  try {
    const globalBadgesPromise = twitchApi<BadgesResponse>('chat/badges/global', {
      method: 'GET',
    })

    const channelBadgesPromise = twitchApi<BadgesResponse>(`chat/badges?broadcaster_id=${twitchId}`, {
      method: 'GET',
    })

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
})
