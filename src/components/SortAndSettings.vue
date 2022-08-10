<script setup>
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useSettings } from "../store/settings";
import {
  CogIcon,
  SortAscendingIcon,
  SortDescendingIcon,
} from "@heroicons/vue/solid";

import SettingsModal from "./SettingsModal.vue";

const route = useRoute();
const router = useRouter();
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
      <SortAscendingIcon v-if="sortOrder === 'asc'" class="w-6 text-blue-500" />
      <SortDescendingIcon v-else class="w-6 text-blue-500" />
    </button>
    <button
      @click="open = true"
      class="p-4 px- rounded-r-md hover:bg-slate-900"
    >
      <CogIcon class="w-6 text-blue-500" />
    </button>
  </div>
  <Teleport to="#app">
    <SettingsModal v-if="open" @close="open = false" />
  </Teleport>
</template>
