<script setup lang="ts">
import type { Breadcrumb, BreadcrumbFunction } from "@/types";
const route = useRoute();

const breadcrumbs = computed(() => {
  const breadcrumb = route.meta.breadcrumb as Breadcrumb[] | BreadcrumbFunction;

  if (typeof breadcrumb === "function") {
    return breadcrumb(route);
  }

  return breadcrumb;
});

const linkedBreadcrumbs = computed(() => {
  const linkedBreadcrumbs = [...breadcrumbs.value];
  linkedBreadcrumbs.pop();
  return linkedBreadcrumbs;
});
</script>

<template>
  <div class="flex items-center gap-1 bg-slate-200 p-4 dark:bg-slate-800">
    <div v-for="crumb in linkedBreadcrumbs" :key="crumb.label">
      <NuxtLink
        :to="crumb.to"
        class="inline-block text-sky-600 hover:underline dark:text-sky-400"
      >
        {{ crumb.label }}
      </NuxtLink>
      /
    </div>
    <span>{{ capitalize(breadcrumbs[breadcrumbs.length - 1].label) }}</span>
  </div>
</template>

<style lang="scss" scoped></style>
