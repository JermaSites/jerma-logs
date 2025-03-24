<script setup lang="ts">
const route = useRoute()

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

const sortStore = useSortStore()
const { sortOrder } = storeToRefs(sortStore)

const isMobileScreen = useMediaQuery('(max-width: 768px)')

const open = ref(false)
</script>

<template>
  <div class="flex">
    <div>
      <SortButton
        :sort-order="sortOrder[sortId]"
        @click="sortStore.toggleSortOrder(sortId)"
      />
    </div>
    <div>
      <UModal v-model:open="open" :fullscreen="isMobileScreen" title="settings" description="settings" :ui="{ content: 'max-w-3xl shadow-2xl', overlay: 'backdrop-blur-sm' }">
        <SettingsButton />

        <template #content>
          <SettingsDialog @close="open = false" />
        </template>
      </UModal>
    </div>
  </div>
</template>

<style scoped></style>
