<script setup lang="ts">
import type { Breadcrumb } from '@/types'
import type { RouteLocationNormalizedLoaded } from '#vue-router'

const route = useRoute()

useServerSeoMeta({
  title: `Jerma Logs | ${route.params.year}`,
  ogTitle: `Jerma Logs | ${route.params.year}`,
})

useSeoMeta({
  title: `Jerma Logs | ${route.params.year}`,
  ogTitle: `Jerma Logs | ${route.params.year}`,
})

definePageMeta({
  validate(route) {
    if (typeof route.params.year !== 'string')
      return false
    const year = Number.parseInt(route.params.year)
    return year >= 2020 && year <= new Date().getFullYear()
  },
  breadcrumb(route: RouteLocationNormalizedLoaded): Breadcrumb[] {
    const year = route.params.year as string
    return [
      {
        label: 'Home',
        to: { name: 'index' },
      },
      {
        label: year,
      },
    ]
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
