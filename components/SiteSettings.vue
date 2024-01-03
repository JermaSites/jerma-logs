<script setup lang="ts">
const route = useRoute();

const sort = computed(() => {
  const routeName = route.name?.toString().split("-").at(-1);

  switch (routeName) {
    case "index":
      return "year";
    case "year":
      return "month";
    case "month":
      return "message";
    case "latest":
      return "latest";
    default:
      return "year";
  }
});

const sortStore = useSortStore();
const { sortOrder } = storeToRefs(sortStore);
</script>

<template>
  <div class="flex">
    <SortButton
      @click="sortStore.toggleSortOrder(sort)"
      :sort-order="sortOrder[sort]"
    />
    <SettingsDialog>
      <template #activator>
        <SettingsButton />
      </template>
    </SettingsDialog>
  </div>
</template>

<style scoped></style>
