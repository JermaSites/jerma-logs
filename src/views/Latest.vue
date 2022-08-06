<script setup>
import NavBar from "../components/NavBar.vue";
import SortAndSettings from "../components/SortAndSettings.vue";
import MessageListLatest from "../components/MessageListLatest.vue";
import ListLoader from "../components/ListLoader.vue";
import ScrollFab from "../components/ScrollFab.vue";
import { useSettings } from "../store/settings";

const settings = useSettings();

function setSortOrder(order) {
  settings.latestSort = order;
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
      <span class="pl-2 pr-4 py-4">Latest</span>
    </template>

    <template #settings>
      <SortAndSettings
        @sort-order="setSortOrder"
        :sort-order="settings.latestSort"
      />
    </template>
  </NavBar>

  <Suspense>
    <MessageListLatest />

    <template #fallback>
      <ListLoader :size="3" />
    </template>
  </Suspense>

  <ScrollFab v-if="settings.fab" />
</template>
