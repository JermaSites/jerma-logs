<script setup>
import { ref, computed, onUnmounted } from "vue";
import { useRoute } from "vue-router";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { useSettings } from "../store/settings";

import MessageListSimple from "../components/MessageListSimple.vue";
import MessageListSeperated from "../components/MessageListSeperated.vue";
import { useEmotes } from "../composables/emotes.js";
import { useBadges } from "../composables/badges.js";

const settings = useSettings();

const layouts = {
  MessageListSimple,
  MessageListSeperated,
};

const { fetchEmotes, parseEmotes } = useEmotes();
const { fetchBadges, parseBadges } = useBadges();

const route = useRoute();
const messages = ref([]);

const docPath = `messagesByYear/${route.params.year}/messagesByMonth/${route.params.month}`;
const docRef = doc(db, docPath);

const docPromise = new Promise(async (resolve) => {
  const unsub = onSnapshot(docRef, (doc) => {
    const { messages: msgs } = doc.data();
    messages.value = msgs;
    resolve({ unsub });
  });
});

const [emotes, badges, res] = await Promise.all([fetchEmotes(), fetchBadges(), docPromise])

onUnmounted(() => {
  res.unsub();
});

const parsedMessages = computed(() => {
  console.time();
  const test = messages.value
    .filter((msg) => msg.username === import.meta.env.VITE_USERNAME)
    .map((msg) => {
      msg.message = parseEmotes(msg.message, emotes);
      msg.badgeURLS = parseBadges(msg.badges, badges);
      return msg;
    });
  console.timeEnd();
  return test;
});
</script>

<template>
  <div class="pb-2">
    <component
      v-if="parsedMessages.length !== 0"
      :is="layouts[settings.layout.componentName]"
      :messages="parsedMessages"
      :chrono="settings.layout.crono"
      :sort-order="settings.messageSort"
    ></component>
    <div v-else class="text-center text-5xl md:text-8xl p-8">
      <h1>No Messages Found</h1>
    </div>
  </div>
</template>
