<script setup>
import YearList from "../components/YearList.vue";
import ListLoader from "../components/ListLoader.vue";
import NavBar from "../components/NavBar.vue";
import SusMessage from "../components/SusMessage.vue";

import { useSettings } from "../store/settings";

const settings = useSettings();
</script>

<template>
  <NavBar />

  <ul class="mb-4">
    <li class="odd:bg-slate-900 even:bg-slate-800">
      <router-link :to="{ name: 'Latest' }" class="block p-4">
        Latest
      </router-link>
    </li>
  </ul>

  <Suspense>
    <section class="mb-4">
      <YearList :sort-order="settings.yearSort" />
    </section>

    <template #fallback>
      <ListLoader class="mb-4" :size="3" />
    </template>
  </Suspense>

  <Suspense>
    <section class="mb-4">
      <SusMessage />
    </section>

    <template #fallback>
      <ListLoader :size="2" class="mb-4" />
    </template>
  </Suspense>
</template>
