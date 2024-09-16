<script setup lang="ts">
import type { SortOrder } from '~/types'

defineProps<{
  sortOrder: SortOrder
}>()
</script>

<template>
  <button
    aria-label="Toggle Sort"
    class="bg-slate-200 p-4 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-900 flex"
  >
    <Icon
      v-if="sortOrder === 'asc'"
      name="heroicons-solid:bars-arrow-down"
      class="h-6 w-6 text-blue-500"
    />
    <Icon v-else name="heroicons-solid:bars-arrow-up" class="h-6 w-6 text-blue-500" />
  </button>
</template>
