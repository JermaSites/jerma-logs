<script setup lang="ts">
type Props = {
  sortOrder: "asc" | "desc";
};

const props = defineProps<Props>();

const years = computed(() => {
  const years: number[] = [];
  const startYear = 2020;
  const currentYear = new Date().getFullYear();
  for (let i = startYear; i <= currentYear; i++) {
    years.push(i);
  }

  return years;
});

const sortedYears = computed(() => {
  return [...years.value].sort((a, b) => {
    if (props.sortOrder === "asc") {
      return a - b;
    }

    return b - a;
  });
});
</script>

<template>
  <SimpleList>
    <SimpleListItem v-for="year in sortedYears" :key="year">
      <NuxtLink
        :to="{ name: 'year', params: { year: year } }"
        class="block p-4 font-medium"
      >
        {{ year }}
      </NuxtLink>
    </SimpleListItem>
  </SimpleList>
</template>

<style scoped></style>
