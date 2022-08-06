<script setup>
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
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
const docSnap = await getDoc(docRef);
const { messages: msgs } = docSnap.data();
messages.value = msgs
  .filter((msg) => msg.username !== "moduspwnens")
  .map((msg) => {
    msg.message = parseMessage(msg);
    msg.badgeURLS = parseBadges(msg);
    return msg;
  })
  .sort((a, b) => +b.sentAt - +a.sentAt);

const unsub = onSnapshot(docRef, (doc) => {
  const { messages: msgs } = doc.data();

  messages.value = msgs
    .filter((msg) => msg.username !== "moduspwnens")
    .map((msg) => {
      msg.message = parseMessage(msg);
      msg.badgeURLS = parseBadges(msg);
      return msg;
    })
    .sort((a, b) => +b.sentAt - +a.sentAt);
});

const sortedMessages = computed(() => {
  if (props.sortOrder === "asc") {
    return messages.value.sort((a, b) => +b.sentAt - +a.sentAt);
  }

  return messages.value.sort((b, a) => +b.sentAt - +a.sentAt);
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
