<script setup>
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import { useSettings } from "../store/settings";
import {
  Cog8ToothIcon,
  BarsArrowUpIcon,
  BarsArrowDownIcon,
} from "@heroicons/vue/24/solid";

import SettingsModal from "./SettingsModal.vue";

const route = useRoute();
const settings = useSettings();

const routeSort = {
  Home: "yearSort",
  Months: "monthSort",
  Messages: "messageSort",
  Latest: "latestSort",
};

const sortOrder = computed(() => {
  return settings[routeSort[route.name]];
});

function toggleSortOrder() {
  settings[routeSort[route.name]] === "asc"
    ? (settings[routeSort[route.name]] = "desc")
    : (settings[routeSort[route.name]] = "asc");
}

const open = ref(false);
</script>

<template>
  <div class="flex">
    <button
      @click="toggleSortOrder"
      class="p-4 rounded-l-md hover:bg-slate-900"
    >
      <BarsArrowUpIcon v-if="sortOrder === 'asc'" class="w-6 h-6 text-blue-500" />
      <BarsArrowDownIcon v-else class="w-6 h-6 text-blue-500" />
    </button>
    <button
      @click="open = true"
      class="p-4 px- rounded-r-md hover:bg-slate-900"
    >
      <Cog8ToothIcon class="w-6 h-6 text-blue-500" />
    </button>
  </div>
  <Teleport to="#app">
    <SettingsModal v-if="open" @close="open = false" />
  </Teleport>
</template>
