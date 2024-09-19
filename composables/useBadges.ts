import type { Badge, BadgeInfo, BadgeMap } from '@/types'

const badges = reactive<BadgeMap>(new Map())

async function fetchBadges() {
  const { data } = await useFetch<Badge[]>('/api/badges')

  data.value?.forEach((badge) => {
    const badgeVersionsMap = new Map(badge.versions.map(v => [v.id, v]))
    badges.set(badge.set_id, badgeVersionsMap)
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
      const badgeURL = badges?.get(name)?.get(version)?.image_url_1x
      return {
        name,
        url: badgeURL || 'https://placehold.co/18x18',
      }
    })
}

export function useBadges() {
  return { fetchBadges, parseBadges }
}
