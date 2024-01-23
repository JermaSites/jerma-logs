<script setup lang="ts">
import type { Breadcrumb, BreadcrumbFunction } from "@/types";

useServerSeoMeta({
  title: "Jerma Logs",
  ogTitle: "Jerma Logs",
});

useSeoMeta({
  title: "Jerma Logs",
  ogTitle: "Jerma Logs",
});

definePageMeta({
  breadcrumb: [
    {
      label: "Home",
    },
  ] as Breadcrumb[] | BreadcrumbFunction,
});

const sortStore = useSortStore();
const { sortOrder } = storeToRefs(sortStore);
</script>

<template>
  <section class="mb-6">
    <YearList :sort-order="sortOrder.year" />
  </section>

  <section class="mb-6">
    <SimpleList>
      <SimpleListItem>
        <NuxtLink :to="{ name: 'latest' }" class="block p-4 font-medium">
          Latest Messages
        </NuxtLink>
      </SimpleListItem>
    </SimpleList>
  </section>

  <section>
    <SusMessage />
  </section>
</template>

<style scoped></style>
