<script setup lang="ts">
import {
  collection,
  query,
  onSnapshot,
  where,
  type Unsubscribe,
} from "firebase/firestore";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import type { Breadcrumb, Message } from "@/types";

dayjs.extend(utc);

useServerSeoMeta({
  title: "Jerma Logs | Latest",
  ogTitle: "Jerma Logs",
});

useSeoMeta({
  title: "Jerma Logs | Latest",
  ogTitle: "Jerma Logs",
});

definePageMeta({
  breadcrumb: [
    {
      label: "Home",
      to: { name: "index" },
    },
    {
      label: "Latest",
    },
  ] as Breadcrumb[],
});

const { fetchEmotes } = useEmotes();
const { fetchBadges } = useBadges();

fetchEmotes();
fetchBadges();

const { data: messages } = await useFetch<Message[]>("/api/messages/latest");

const sortStore = useSortStore();
const { sortOrder } = storeToRefs(sortStore);

const sortedMessages = computed(() => {
  return messages?.value?.sort((a, b) => {
    if (sortOrder.value.latest === "asc") {
      return parseInt(a.sentAt) - parseInt(b.sentAt);
    }

    return parseInt(b.sentAt) - parseInt(a.sentAt);
  });
});

const { db } = useFirebase();
const { twitchUsername } = useRuntimeConfig().public;
const unsub = ref<Unsubscribe>();

onMounted(async () => {
  const latestMessage = messages.value?.at(-1);

  if (!latestMessage) return;

  const dayOfLatestMessage = dayjs
    .utc(parseInt(latestMessage.sentAt))
    .subtract(1, "day")
    .valueOf()
    .toString();

  const latestMessagesQuery = query(
    collection(db, "messages"),
    where("username", "==", twitchUsername),
    where("sentAt", ">=", dayOfLatestMessage)
  );

  unsub.value = onSnapshot(latestMessagesQuery, (querySnapshot) => {
    messages.value = querySnapshot.docs.map((doc) => doc.data() as Message);
  });
});

onUnmounted(() => {
  if (!unsub.value) return;
  unsub.value();
});
</script>

<template>
  <section>
    <div
      v-if="sortedMessages && sortedMessages.length !== 0"
      class="flex flex-col"
    >
      <SimpleList>
        <SimpleListItem v-for="message in sortedMessages" :key="message.id">
          <Message :message="message" />
        </SimpleListItem>
      </SimpleList>
    </div>

    <div v-else class="p-8 text-center text-5xl md:text-8xl">
      <h1>No Messages Found</h1>
    </div>
  </section>
</template>

<style scoped></style>
