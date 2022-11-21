<script setup>
import MessageList from "../components/MessageList.vue";
import ListLoader from "../components/ListLoader.vue";
import NavBar from "../components/NavBar.vue";
import SortAndSettings from "../components/SortAndSettings.vue";
import ScrollFab from "../components/ScrollFab.vue";
import { useSettings } from "../store/settings";

const settings = useSettings();

function setSortOrder(order) {
  settings.messageSort = order;
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
    <MessageList />

    <template #fallback>
      <ListLoader :size="3" />
    </template>
  </Suspense>

  <ScrollFab v-if="settings.fab" />
</template>
