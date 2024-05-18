<script setup lang="ts">
defineProps<Props>()

interface Props {
  rows: number
}
</script>

<template>
  <SimpleList>
    <SimpleListItem v-for="i in $props.rows" :key="i" class="h-14 p-5">
      <div class="flex gap-1">
        <USkeleton class="h-4 w-[200px]" :ui="{ background: 'bg-slate-400 dark:bg-slate-600' }" />
        <USkeleton class="h-4 w-[150px]" :ui="{ background: 'bg-slate-400 dark:bg-slate-600' }" />
        <USkeleton class="h-4 w-full" :ui="{ background: 'bg-slate-400 dark:bg-slate-600' }" />
      </div>
    </SimpleListItem>
  </SimpleList>
</template>

<style scoped>

</style>
