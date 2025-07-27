export default defineEventHandler(async () => {
  const globalBadgesPromise = twitchApi<BadgesResponse>(
    'chat/badges/global',
    {
      method: 'GET',
    },
  )

  const channelBadgesPromise = twitchApi<BadgesResponse>(
    'chat/badges?broadcaster_id=23936415',
    {
      method: 'GET',
    },
  )

  const [globalBadges, channelBadges] = await Promise.all([
    globalBadgesPromise,
    channelBadgesPromise,
  ])

  const badges = [...globalBadges.data, ...channelBadges.data]

  return badges
})
