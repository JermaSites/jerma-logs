const badgeMap = reactive<BadgeMap>(new Map())
const isLoading = ref(false)
const error = ref<string | null>(null)

export default function () {
  async function fetchBadges() {
    if (isLoading.value)
      return

    try {
      const badges = await $fetch<Badge[]>('/api/badges')

      if (!badges || badges.length === 0) {
        console.warn('No badges received from API')
        return
      }

      badges.forEach((badge) => {
        const badgeVersionsMap = new Map(badge.versions.map(v => [v.id, v]))
        badgeMap.set(badge.set_id, badgeVersionsMap)
      })
    }
    catch (err) {
      error.value = 'Failed to fetch badges'
      console.error('Badge fetch error:', err)
    }
    finally {
      isLoading.value = false
    }
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
    isLoading: readonly(isLoading),
    error: readonly(error),
  }
}
