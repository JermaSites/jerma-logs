const PLACEHOLDER_BADGE = 'https://placehold.co/18x18'

function getBadgeRank(badge: string): number {
  switch (badge) {
    case 'broadcaster': return 0
    case 'subscriber': return 1
    default: return 2
  }
}

export default function () {
  const nuxtApp = useNuxtApp()

  // Per-request on the server (nuxtApp is created per request), per-session on
  // the client. Module-scope state would be shared across every SSR request.
  const badgeMap = (nuxtApp._badgeMap ??= shallowRef<BadgeMap>(new Map()))

  async function fetchBadges() {
    if (badgeMap.value.size)
      return badgeMap.value

    try {
      const badges = await $fetch<Badge[]>('/api/badges')

      if (!badges?.length) {
        console.warn('No badges received from API')
        return badgeMap.value
      }

      badgeMap.value = new Map(badges.map(badge => [
        badge.set_id,
        new Map(badge.versions.map(version => [version.id, version])),
      ]))
    }
    catch (error) {
      console.error('Badge fetch error:', error)
    }

    return badgeMap.value
  }

  function parseBadges(badgeInfo: BadgeInfo): ParsedBadge[] {
    if (!badgeInfo)
      return []

    return Object.entries(badgeInfo)
      .sort(([a], [b]) => getBadgeRank(a) - getBadgeRank(b))
      .map(([name, version]) => ({
        name,
        url: badgeMap.value.get(name)?.get(version ?? '')?.image_url_1x || PLACEHOLDER_BADGE,
      }))
  }

  return {
    fetchBadges,
    parseBadges,
  }
}
