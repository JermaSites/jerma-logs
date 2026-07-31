export const useSortStore = defineStore(
  'sort',
  () => {
    const sortOrder = reactive<SortableCategories>({
      year: 'asc',
      month: 'asc',
      message: 'asc',
      latest: 'asc',
    })

    function toggleSortOrder(id: keyof typeof sortOrder) {
      sortOrder[id] = sortOrder[id] === 'asc'
        ? 'desc'
        : 'asc'
    }

    const updateCookieExpiration = ref(false)

    function refreshCookieExpiration() {
      updateCookieExpiration.value = !updateCookieExpiration.value
    }

    return {
      sortOrder,
      toggleSortOrder,
      // Must be returned to count as store state — otherwise mutating it never
      // triggers persistence and the cookie's expiry is never extended.
      updateCookieExpiration,
      refreshCookieExpiration,
    }
  },
  { persist: true },
)
