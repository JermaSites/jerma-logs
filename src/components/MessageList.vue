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

const props = defineProps({
  sortOrder: String,
});

const settings = useSettings();

const layouts = {
  MessageListSimple,
  MessageListSeperated,
};

const { parseMessage } = await useEmotes();
const { parseBadges } = await useBadges();

const route = useRoute();
const messages = ref([]);

const docPath = `messagesByYear/${route.params.year}/messagesByMonth/${route.params.month}`;
const docRef = doc(db, docPath);

const unsub = onSnapshot(docRef, (doc) => {
  const { messages: msgs } = doc.data();
  messages.value = msgs;
});

onUnmounted(() => {
  unsub();
});

const parsedMessages = computed(() => {
  console.time("parse emotes and badges");
  const t = messages.value
    .filter((msg) => msg.username == "moduspwnens")
    .map((msg) => {
      msg.message = parseMessage(msg);
      msg.badgeURLS = parseBadges(msg);
      return msg;
    })
    .sort((a, b) => +b.sentAt - +a.sentAt);
  console.timeEnd("parse emotes and badges");
  return t;
});

const sortedMessages = computed(() => {
  if (props.sortOrder === "asc") {
    return parsedMessages.value.sort((a, b) => +b.sentAt - +a.sentAt);
  }

  return parsedMessages.value.sort((b, a) => +b.sentAt - +a.sentAt);
});
</script>

<template>
  <div class="pb-2">
    <component
      :is="layouts[settings.layout.componentName]"
      :messages="sortedMessages"
      :chrono="settings.layout.crono"
    ></component>
  </div>
</template>
