export default function () {
  const badgeMap = reactive<BadgeMap>(new Map())

  async function fetchBadges() {
    const { data: badges } = await useFetch<Badge[]>('/api/badges', {
      default() {
        return []
      },
    })

    badges.value.forEach((badge) => {
      const badgeVersionsMap = new Map(badge.versions.map(v => [v.id, v]))
      badgeMap.set(badge.set_id, badgeVersionsMap)
    })
  }

  function getBadgeRank(badge: string): number {
    switch (badge) {
      case 'broadcaster': return 0
      case 'subscriber': return 1
      default: return 2
    }
  }

  function parseBadges(badgeInfo: BadgeInfo) {
    if (!badgeInfo)
      return []

    return Object.entries(badgeInfo)
      .sort(([a], [b]) => getBadgeRank(a) - getBadgeRank(b))
      .map(([name, version]) => {
        const badgeURL = badgeMap.get(name)?.get(version)?.image_url_1x
        return {
          name,
          url: badgeURL || 'https://placehold.co/18x18',
        }
      })
  }

  return {
    fetchBadges,
    parseBadges,
  }
}
