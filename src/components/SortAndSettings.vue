<script setup>
import { ref } from "vue";
import {
  CogIcon,
  SortAscendingIcon,
  SortDescendingIcon,
} from "@heroicons/vue/solid";

import SettingsModal from "./SettingsModal.vue";

const props = defineProps({
  sortOrder: {
    type: String,
    required: true,
  },
});

const emits = defineEmits(["sortOrder"]);

const open = ref(false);

function toggleSortOrder() {
  props.sortOrder === "asc"
    ? emits("sortOrder", "desc")
    : emits("sortOrder", "asc");
}
</script>

<template>
  <button @click="toggleSortOrder" class="p-4 rounded-l-md hover:bg-slate-900">
    <SortAscendingIcon v-if="sortOrder === 'asc'" class="w-6 text-blue-500" />
    <SortDescendingIcon v-else class="w-6 text-blue-500" />
  </button>
  <button @click="open = true" class="p-4 rounded-r-md hover:bg-slate-900">
    <CogIcon class="w-6 text-blue-500" />
  </button>
  <Teleport to="#app">
    <SettingsModal v-if="open" @close="open = false" />
  </Teleport>
</template>
