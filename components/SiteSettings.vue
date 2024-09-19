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
      <SettingsDialog>
        <template #activator>
          <SettingsButton />
        </template>
      </SettingsDialog>
    </div>
  </div>
</template>

<style scoped></style>
