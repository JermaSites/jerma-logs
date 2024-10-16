import twitchApi from '../../utils/twitch'

interface BadgesResponse {
  data: [
    {
      set_id: string
      versions: [
        {
          id: string
          image_url_1x: string
          image_url_2x: string
          image_url_4x: string
          title: string
          description: string
          click_action: string | null
          click_url: string | null
        },
      ]
    },
  ]
}

export default cachedEventHandler(
  async () => {
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
  },
  {
    maxAge: 60 * 60 * 24,
  },
)
