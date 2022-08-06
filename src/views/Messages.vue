<script setup>
import { useRoute } from "vue-router";
import MessageList from "../components/MessageList.vue";
import ListLoader from "../components/ListLoader.vue";
import NavBar from "../components/NavBar.vue";
import SortAndSettings from "../components/SortAndSettings.vue";
import ScrollFab from "../components/ScrollFab.vue";
import { useSettings } from "../store/settings";

const settings = useSettings();

const route = useRoute();

function setSortOrder(order) {
  settings.messageSort = order;
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

  <ScrollFab v-if="settings.fab" />
</template>
