<script setup>
import { ref, computed, onUnmounted } from "vue";
import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  where,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase";
import dayjs from "dayjs";
import { useSettings } from "../store/settings";
import MessageListSimple from "../components/MessageListSimple.vue";
import MessageListSeperated from "../components/MessageListSeperated.vue";
import { useEmotes } from "../composables/emotes.js";
import { useBadges } from "../composables/badges.js";
import ScrollFab from "../components/ScrollFab.vue";

const layouts = {
  MessageListSimple,
  MessageListSeperated,
};

const settings = useSettings();

const { fetchEmotes, parseEmotes } = useEmotes();
const { fetchBadges, parseBadges } = useBadges();

const emotes = await fetchEmotes();
const badges = await fetchBadges();

// Get the most recent message
const latestMessageQuery = query(
  collection(db, "messages"),
  where("username", "==", import.meta.env.VITE_USERNAME),
  orderBy("sentAt", "desc"),
  limit(1)
);

const latestMessageQuerySnapshot = await getDocs(latestMessageQuery);

const latestMessage = latestMessageQuerySnapshot.docs[0].data();

// Get the day the most recent message was sent
const latestMessagesDaySent = dayjs(+latestMessage.sentAt)
  .startOf("day")
  .valueOf();

// Query for all messages sent on the same day as the latest message
const latestMessagesQuery = query(
  collection(db, "messages"),
  where("sentAt", ">=", latestMessagesDaySent.toString())
);

const latestMessages = ref([]);

const res = await new Promise(async (resolve) => {
  const unsub = onSnapshot(latestMessagesQuery, (querySnapshot) => {
    const messages = [];
    querySnapshot.forEach((doc) => {
      messages.push(doc.data());
    });

    latestMessages.value = messages;

    resolve({ unsub });
  });
});

onUnmounted(() => {
  res.unsub();
});

const parsedMessages = computed(() => {
  return latestMessages.value
    .filter((msg) => msg.username === import.meta.env.VITE_USERNAME)
    .map((msg) => {
      msg.message = parseEmotes(msg.message, emotes);
      msg.badgeURLS = parseBadges(msg.badges, badges);
      return msg;
    })
    .sort((a, b) => +b.sentAt - +a.sentAt);
});
</script>

<template>
  <div class="pb-2">
    <component
      :is="layouts[settings.layout.componentName]"
      :messages="parsedMessages"
      :chrono="settings.layout.crono"
      :sort-order="settings.latestSort"
    ></component>
  </div>

  <ScrollFab v-if="settings.fab" />
</template>
