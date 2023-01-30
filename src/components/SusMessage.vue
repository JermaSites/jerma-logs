<script setup>
import { reactive, computed } from "vue";
import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  where,
} from "firebase/firestore";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import advancedFormat from "dayjs/plugin/advancedFormat";
import { db } from "../firebase";
import { useEmotes } from "../composables/emotes.js";
import { useBadges } from "../composables/badges.js";

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(advancedFormat);

const { fetchEmotes, parseEmotes } = useEmotes();
const { fetchBadges, parseBadges } = useBadges();

const username = import.meta.env.VITE_USERNAME;

// Get the most recent message
const latestSusMessageQuery = query(
  collection(db, "sus"),
  where("username", "==", username),
  orderBy("sentAt", "desc"),
  limit(1)
);

const [emotes, badges, latestMessageQuerySnapshot] = await Promise.all([
  fetchEmotes(),
  fetchBadges(),
  getDocs(latestSusMessageQuery),
]);

const latestMessage = reactive(latestMessageQuerySnapshot?.docs[0]?.data());

const parsedMessage = computed(() => {
  if (latestMessage) {
    latestMessage.message = parseEmotes(latestMessage.message, emotes);
    latestMessage.badgeURLS = parseBadges(latestMessage.badges, badges);
    return latestMessage.message.split("!sus ")[1]
  }

  return ""
});

const messageSentAtTimeAgo = computed(() => {
  const sentAt = +latestMessage.sentAt;
  return dayjs(sentAt).fromNow();
});
</script>

<template>
  <div class="text-center">
    <div class="bg-slate-900 px-4 py-2">
      <h1 class="text-xl font-meduim">Latest Sus (set {{ messageSentAtTimeAgo }})</h1>
    </div>
    <div class="bg-slate-800 p-4">
      <div v-if="parsedMessage" v-html="parsedMessage"></div>
      <div v-else>No Sus Yet!</div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
