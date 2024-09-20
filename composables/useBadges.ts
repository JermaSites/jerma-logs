import type { Badge, BadgeMap, Badges } from '@/types'

const badgesMap = reactive<BadgeMap>(new Map())

async function fetchBadges() {
  const { data } = await useFetch<Badge[]>('/api/badges')

  data.value?.forEach((badge) => {
    const badgeVersionsMap = new Map(badge.versions.map(v => [v.id, v]))
    badgesMap.set(badge.set_id, badgeVersionsMap)
  })
}

function getBadgeRank(badge: string): number {
  switch (badge) {
    case 'broadcaster': return 0
    case 'subscriber': return 1
    default: return 2
  }
}

function parseBadges(badges: Badges) {
  if (!badges)
    return []

  return Object.entries(badges)
    .sort(([a], [b]) => getBadgeRank(a) - getBadgeRank(b))
    .map(([name, version]) => {
      const badgeURL = badgesMap?.get(name)?.get(version)?.image_url_1x
      return {
        name,
        url: badgeURL || 'https://placehold.co/18x18',
      }
    })
}

export function useBadges() {
  return { fetchBadges, parseBadges }
}
