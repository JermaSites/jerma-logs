<script setup lang="ts">
const props = defineProps<{
  sortOrder: SortOrder
}>()

const START_YEAR = 2020

const sortedYears = computed(() => {
  const currentYear = new Date().getFullYear()
  const years = Array.from(
    { length: currentYear - START_YEAR + 1 },
    (_, index) => START_YEAR + index,
  )

  return props.sortOrder === 'asc' ? years : years.reverse()
})
</script>

<template>
  <SimpleList>
    <SimpleListItem v-for="year in sortedYears" :key="year">
      <NuxtLink
        :to="{ name: 'year', params: { year } }"
        class="block p-4 font-medium"
      >
        {{ year }}
      </NuxtLink>
    </SimpleListItem>
  </SimpleList>
</template>
