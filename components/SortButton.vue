<script setup lang="ts">
import { BarsArrowDownIcon, BarsArrowUpIcon } from '@heroicons/vue/24/solid'
import type { SortOrder } from '~/types'

const props = defineProps<{
  sortOrder: SortOrder
}>()

console.log('sort button prop:', props.sortOrder)
</script>

<template>
  <button
    aria-label="Toggle Sort"
    class="block bg-slate-200 p-4 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-900"
  >
    <BarsArrowUpIcon
      v-if="sortOrder === 'asc'"
      class="h-6 w-6 text-blue-500"
    />
    <BarsArrowDownIcon v-else class="h-6 w-6 text-blue-500" />
  </button>
</template>
