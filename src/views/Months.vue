<script setup>
import { useRoute } from "vue-router";
import MonthList from "../components/MonthList.vue";
import ListLoader from "../components/ListLoader.vue";
import NavBar from "../components/NavBar.vue";
import SortAndSettings from "../components/SortAndSettings.vue";
import { useSettings } from "../store/settings";

const settings = useSettings();

function setSortOrder(order) {
  settings.monthSort = order;
}
</script>

<template>
  <NavBar>
    <template #settings>
      <SortAndSettings
        @sort-order="setSortOrder"
        :sort-order="settings.messageSort"
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
