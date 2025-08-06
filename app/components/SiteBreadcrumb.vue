<script setup lang="ts">
const breadcrumbs = useBreadcrumbItems()
</script>

<template>
  <div class="flex items-center gap-1 bg-slate-200 p-4 dark:bg-slate-800">
    <div v-for="crumb in breadcrumbs.slice(0, -1)" :key="crumb.label">
      <NuxtLink :to="crumb.to" class="inline-block text-sky-600 hover:underline dark:text-sky-400">
        {{ crumb.label }}
      </NuxtLink>
      /
    </div>
    <span>{{ breadcrumbs.at(-1)?.label }}</span>
  </div>
</template>
