<script setup lang="ts">
const props = defineProps<{
  sortOrder: SortOrder
}>()

const route = useRoute()

const RECORDING_START_YEAR = 2020 // only started recording form May 2020 onward
const RECORDING_START_MONTH = 4 // May (0-based)

const months = [
  { name: 'January', id: 0 },
  { name: 'February', id: 1 },
  { name: 'March', id: 2 },
  { name: 'April', id: 3 },
  { name: 'May', id: 4 },
  { name: 'June', id: 5 },
  { name: 'July', id: 6 },
  { name: 'August', id: 7 },
  { name: 'September', id: 8 },
  { name: 'October', id: 9 },
  { name: 'November', id: 10 },
  { name: 'December', id: 11 },
]

const filteredMonths = computed(() => {
  const selectedYear = Number.parseInt(route.params.year as string)
  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth()

  if (selectedYear === currentYear) {
    return months.slice(0, currentMonth + 1)
  }
  else if (selectedYear === RECORDING_START_YEAR) {
    return months.slice(RECORDING_START_MONTH)
  }

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
