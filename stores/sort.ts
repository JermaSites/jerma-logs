interface SortOrder {
  year: SortType
  month: SortType
  message: SortType
  latest: SortType
}

type SortType = 'asc' | 'desc'

export const useSortStore = defineStore(
  'sort',
  () => {
    const sortOrder = reactive<SortOrder>({
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

    const updateCookieExperation = ref(false)

    return { sortOrder, toggleSortOrder, updateCookieExperation }
  },
  { persist: true },
)
