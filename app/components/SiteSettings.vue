<script setup lang="ts">
const route = useRoute()
const sortStore = useSortStore()
const { sortOrder } = storeToRefs(sortStore)

const isMobileScreen = useMediaQuery('(max-width: 768px)')

const sortId = computed(() => {
  switch (route.name) {
    case 'index':
      return 'year'
    case 'year':
      return 'month'
    case 'year-month':
      return 'message'
    case 'latest':
      return 'latest'
    default:
      return 'year'
  }
})

const open = ref(false)
</script>

<template>
  <div class="flex">
    <NuxtLink v-if="route.name !== 'search'" to="/search" class="mr-2">
      <div class="bg-slate-200 p-4 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-900 flex cursor-pointer">
        <UIcon name="heroicons-solid:magnifying-glass" class="size-6 text-blue-500" />
        <span class="max-sm:hidden ml-2">Search</span>
      </div>
    </NuxtLink>
    <div>
      <SortButton
        v-if="route.name !== 'search'"
        :sort-order="sortOrder[sortId]"
        @click="sortStore.toggleSortOrder(sortId)"
      />
    </div>
    <div>
      <UModal v-model:open="open" :fullscreen="isMobileScreen" title="settings" description="settings" :ui="{ content: 'max-w-3xl shadow-2xl', overlay: 'backdrop-blur-sm' }">
        <SettingsButton />

        <template #content>
          <LazySettingsDialog @close="open = false" />
        </template>
      </UModal>
    </div>
  </div>
</template>
