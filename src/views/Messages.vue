<script setup>
import { useRoute } from "vue-router";
import MessageList from "../components/MessageList.vue";
import ListLoader from "../components/ListLoader.vue";
import NavBar from "../components/NavBar.vue";
import SortAndSettings from "../components/SortAndSettings.vue";
import { useSettings } from "../store/settings";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/vue/solid";

const settings = useSettings();

const route = useRoute();

function setSortOrder(order) {
  settings.messageSort = order;
}

function scrollToTop() {
  window.scroll({
    top: 0,
    left: 0,
    behavior: "smooth",
  });
}

function scrollToBottom() {
  window.scroll({
    top: document.body.scrollHeight,
    left: 0,
    behavior: "smooth",
  });
}
</script>

<template>
  <NavBar>
    <template #nav>
      <div class="flex items-center gap-1">
        <router-link
          :to="{ name: 'Home' }"
          class="text-sky-400 hover:underline pl-4 py-4 inline-block"
        >
          Home
        </router-link>
        /
        <router-link
          :to="{ name: 'Months' }"
          class="text-sky-400 hover:underline py-4 inline-block"
        >
          {{ route.params.year }}
        </router-link>
        /
        <span class="pr-4 py-4">{{ route.params.month }}</span>
      </div>
    </template>

    <template #settings>
      <SortAndSettings
        @sort-order="setSortOrder"
        :sort-order="settings.messageSort"
      />
    </template>
  </NavBar>

  <Suspense>
    <MessageList :sort-order="settings.messageSort" />

    <template #fallback>
      <ListLoader :size="3" />
    </template>
  </Suspense>

  <div
    v-if="settings.fab"
    class="fixed z-90 bottom-6 right-6 flex flex-col gap-5"
  >
    <button
      @click="scrollToTop"
      class="bg-slate-800 w-14 h-14 rounded-full flex justify-center items-center border-2 border-slate-500 drop-shadow-md"
    >
      <ChevronUpIcon class="w-6 text-blue-500 bg-slate-800" />
    </button>

    <button
      @click="scrollToBottom"
      class="bg-slate-800 w-14 h-14 rounded-full flex justify-center items-center border-2 border-slate-500 drop-shadow-md"
    >
      <ChevronDownIcon class="w-6 text-blue-500 bg-slate-800" />
    </button>
  </div>
</template>
