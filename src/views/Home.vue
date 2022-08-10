<script setup>
import YearList from "../components/YearList.vue";
import ListLoader from "../components/ListLoader.vue";
import NavBar from "../components/NavBar.vue";

import { useSettings } from "../store/settings";

const settings = useSettings();

function setSortOrder(order) {
  settings.yearSort = order;
}
</script>

<template>
  <NavBar />

  <Suspense>
    <section>
      <ul class="mb-4">
        <li class="odd:bg-slate-900 even:bg-slate-800">
          <router-link :to="{ name: 'Latest' }" class="block p-4">
            Latest
          </router-link>
        </li>
      </ul>
      <YearList :sort-order="settings.yearSort" />
    </section>

    <template #fallback>
      <ListLoader :size="3" />
    </template>
  </Suspense>
</template>
