<script setup lang="ts">
import type { RouteLocationNormalizedLoaded } from '#vue-router'
import type { Breadcrumb } from '@/types'

const route = useRoute()

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

const sortStore = useSortStore()
const { sortOrder } = storeToRefs(sortStore)
</script>

<template>
  <section>
    <MonthList :sort-order="sortOrder.month" />
  </section>
</template>

<style scoped></style>
