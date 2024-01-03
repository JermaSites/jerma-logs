<script setup lang="ts">
type Props = {
  sortOrder: "asc" | "desc";
};

type Month = {
  name: string;
  id: number;
};

const props = defineProps<Props>();

const route = useRoute();

const months: Month[] = [
  { name: "January", id: 0 },
  { name: "February", id: 1 },
  { name: "March", id: 2 },
  { name: "April", id: 3 },
  { name: "May", id: 4 },
  { name: "June", id: 5 },
  { name: "July", id: 6 },
  { name: "August", id: 7 },
  { name: "September", id: 8 },
  { name: "October", id: 9 },
  { name: "November", id: 10 },
  { name: "December", id: 11 },
];

const orderedMonths = computed(() => {
  return [...months].sort((a, b) => a.id - b.id);
});

const filteredMonths = computed(() => {
  const selectedYear = route.params.year as string;
  const date = new Date();
  const currentYear = date.getFullYear();
  const currentMonth = date.getMonth();

  let recordedMonths = [...orderedMonths.value];
  if (parseInt(selectedYear) === currentYear) {
    recordedMonths = recordedMonths.slice(0, currentMonth + 1);
  } else if (parseInt(selectedYear) === 2020) {
    // only started recording form May 2020 onward
    recordedMonths = recordedMonths.slice(4);
  }

  return recordedMonths;
});

const sortedMonths = computed(() => {
  return [...filteredMonths.value].sort((a, b) => {
    if (props.sortOrder === "asc") {
      return a.id - b.id;
    }

    return b.id - a.id;
  });
});
</script>

<template>
  <SimpleList
    :items="sortedMonths"
    item-key="name"
    v-slot="{ item }: { item: Month }"
  >
    <NuxtLink
      :to="{
        name: 'year-month',
        params: {
          year: route.params.year,
          month: item.name.toLocaleLowerCase(),
        },
      }"
      class="block p-4 font-medium"
    >
      {{ item.name }}
    </NuxtLink>
  </SimpleList>
</template>

<style scoped></style>
