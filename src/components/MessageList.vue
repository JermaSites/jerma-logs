<script setup>
import { ref, computed, onUnmounted } from "vue";
import { useRoute } from "vue-router";
import { doc, collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { useSettings } from "../store/settings";
import dayjs from "dayjs";
import customParseFormat  from "dayjs/plugin/customParseFormat";

import MessageListSimple from "../components/MessageListSimple.vue";
import MessageListSeperated from "../components/MessageListSeperated.vue";
import { useEmotes } from "../composables/emotes.js";
import { useBadges } from "../composables/badges.js";
dayjs.extend(customParseFormat)


const settings = useSettings();

const layouts = {
  MessageListSimple,
  MessageListSeperated,
};

const { fetchEmotes, parseEmotes } = useEmotes();
const { fetchBadges, parseBadges } = useBadges();

const route = useRoute();
const messages = ref([]);

// const docPath = `messagesByYear/${route.params.year}/messagesByMonth/${route.params.month}`;
// const docRef = doc(db, docPath);

// const docPromise = new Promise(async (resolve) => {
//   const unsub = onSnapshot(docRef, (doc) => {
//     const { messages: msgs } = doc.data();
//     messages.value = msgs;
//     resolve({ unsub });
//   });
// });

const monthAndYear = dayjs(`${route.params.year}-${route.params.month}`,"YYYY-MMMM");

const startTimestamp = monthAndYear.startOf("month").valueOf();
const endTimestamp = monthAndYear.endOf("month").valueOf();

const username = import.meta.env.VITE_USERNAME;

const q = query(
  collection(db, "messages"),
  where("sentAt", ">=", startTimestamp.toString()),
  where("sentAt", "<=", endTimestamp.toString()),
  where("username", "==", username)
);

const docPromise = new Promise(async (resolve) => {
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const msgs = [];
    querySnapshot.forEach((doc) => {
      msgs.push(doc.data());
    });
    messages.value = msgs;
  });
  resolve({ unsubscribe });
});

const [emotes, badges, res] = await Promise.all([
  fetchEmotes(),
  fetchBadges(),
  docPromise,
]);

const parsedMessages = computed(() => {
  return messages.value.map((msg) => {
    msg.message = parseEmotes(msg.message, emotes);
    msg.badgeURLS = parseBadges(msg.badges, badges);
    return msg;
  });
});

onUnmounted(() => {
  res.unsubscribe();
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
