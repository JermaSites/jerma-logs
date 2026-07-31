<script setup lang="ts">
defineProps<{
  rows: number
}>()
</script>

<template>
  <SimpleList>
    <SimpleListItem v-for="i in rows" :key="i" class="h-14 p-5">
      <div class="flex gap-1">
        <USkeleton class="h-4 w-50 bg-slate-400 dark:bg-slate-600" />
        <USkeleton class="h-4 w-37.5 bg-slate-400 dark:bg-slate-600" />
        <USkeleton class="h-4 w-full bg-slate-400 dark:bg-slate-600" />
      </div>
    </SimpleListItem>
  </SimpleList>
</template>
