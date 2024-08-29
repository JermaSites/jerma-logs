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
console.log('Settings sort order:', sortOrder.value[sortId.value], sortId.value)
</script>

<template>
  <div class="flex">
    <SortButton
      :sort-order="sortOrder[sortId]"
      @click="sortStore.toggleSortOrder(sortId)"
    />
    <SettingsDialog>
      <template #activator>
        <SettingsButton />
      </template>
    </SettingsDialog>
  </div>
</template>

<style scoped></style>
