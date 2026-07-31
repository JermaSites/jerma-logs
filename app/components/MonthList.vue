<script setup lang="ts">
const props = defineProps<{
  sortOrder: SortOrder
}>()

const route = useRoute()

const RECORDING_START_YEAR = 2020 // only started recording from May 2020 onward
const RECORDING_START_MONTH = 4 // May (0-based)

const months = MONTH_NAMES.map((name, id) => ({ name, id }))

const filteredMonths = computed(() => {
  const selectedYear = Number.parseInt(route.params.year as string)
  const now = new Date()

  if (selectedYear === now.getFullYear())
    return months.slice(0, now.getMonth() + 1)

  if (selectedYear === RECORDING_START_YEAR)
    return months.slice(RECORDING_START_MONTH)

  return months
})

const sortedMonths = computed(() => {
  return filteredMonths.value.toSorted((a, b) => {
    return props.sortOrder === 'asc' ? a.id - b.id : b.id - a.id
  })
})
</script>

<template>
  <SimpleList>
    <SimpleListItem v-for="month in sortedMonths" :key="month.id">
      <NuxtLink
        :to="{
          name: 'year-month',
          params: {
            year: route.params.year,
            month: month.name.toLocaleLowerCase(),
          },
        }"
        class="block p-4 font-medium"
      >
        {{ month.name }}
      </NuxtLink>
    </SimpleListItem>
  </SimpleList>
</template>
