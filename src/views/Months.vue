<script setup>
import { useRoute } from "vue-router";
import MonthList from "../components/MonthList.vue";
import ListLoader from "../components/ListLoader.vue";
import NavBar from "../components/NavBar.vue";
import SortAndSettings from "../components/SortAndSettings.vue";
import { useSettings } from "../store/settings";

const settings = useSettings();

const route = useRoute();

function setSortOrder(order) {
  console.log(order);
  settings.monthSort = order;
}
</script>

<template>
  <NavBar>
    <template #nav>
      <router-link
        :to="{ name: 'Home' }"
        class="text-sky-400 hover:underline pl-4 pr-2 py-4 inline-block"
      >
        Home
      </router-link>
      /
      <span class="pl-2 pr-4 py-4">{{ route.params.year }}</span>
    </template>

    <template #settings>
      <SortAndSettings
        @sort-order="setSortOrder"
        :sort-order="settings.monthSort"
      />
    </template>
  </NavBar>

  <Suspense>
    <MonthList :sort-order="settings.monthSort" />

    <template #fallback>
      <ListLoader :size="12" />
    </template>
  </Suspense>
</template>
