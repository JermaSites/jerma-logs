<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const breadcrumbs = computed(() => {
  const breadcrumb = route.meta.breadcrumb;

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
  <div class="flex items-center gap-1">
    <div v-for="route in linkedBreadcrumbs" :key="route">
      <router-link
        :to="route.to"
        class="text-sky-400 hover:underline inline-block"
      >
        {{ route.label }}
      </router-link>
      /
    </div>
    <span>{{ breadcrumbs[breadcrumbs.length - 1].label }}</span>
  </div>
</template>

<style lang="scss" scoped></style>
