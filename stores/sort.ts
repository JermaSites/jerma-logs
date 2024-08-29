import type { SortableCategories } from '~/types'

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
      console.log('toggle before:', sortOrder[id])
      sortOrder[id] = sortOrder[id] === 'asc'
        ? 'desc'
        : 'asc'
      console.log('toggle after:', sortOrder[id])
    }

    const updateCookieExperation = ref(false)

    return { sortOrder, toggleSortOrder, updateCookieExperation }
  },
  { persist: true },
)
