<script setup lang="ts">
import { BarsArrowUpIcon, BarsArrowDownIcon } from "@heroicons/vue/24/solid";

type Props = {
  sortOrder: "asc" | "desc";
};

defineProps<Props>();
</script>

<template>
  <button
    aria-label="Toggle Sort"
    class="block bg-slate-200 p-4 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-900"
  >
    <BarsArrowDownIcon
      v-if="sortOrder === 'asc'"
      class="h-6 w-6 text-blue-500"
    />
    <BarsArrowUpIcon v-else class="h-6 w-6 text-blue-500" />
  </button>
</template>
