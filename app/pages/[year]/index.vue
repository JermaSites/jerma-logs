<script setup lang="ts">
const route = useRoute()

const sortStore = useSortStore()
const { sortOrder } = storeToRefs(sortStore)

useSeoMeta({
  title: `${route.params.year}`,
})

definePageMeta({
  validate(route) {
    if (typeof route.params.year !== 'string')
      return false

    const year = Number.parseInt(route.params.year)
    return year >= 2020 && year <= new Date().getFullYear()
  },
})
</script>

<template>
  <section>
    <MonthList :sort-order="sortOrder.month" />
  </section>
</template>
