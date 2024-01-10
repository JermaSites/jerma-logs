<script setup lang="ts">
import { capitalize } from "vue";
import type { Breadcrumb, Message } from "@/types";
import type { RouteLocationNormalizedLoaded } from "#vue-router";
import { collection, query, onSnapshot, where } from "firebase/firestore";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";

dayjs.extend(utc);

const route = useRoute();

useServerSeoMeta({
  title: `Jerma Logs | ${capitalize(route.params.month as string)} ${
    route.params.year
  }`,
  ogTitle: `Jerma Logs | ${capitalize(route.params.month as string)} ${
    route.params.year
  }`,
});

useSeoMeta({
  title: `Jerma Logs | ${capitalize(route.params.month as string)} ${
    route.params.year
  }`,
  ogTitle: `Jerma Logs | ${capitalize(route.params.month as string)} ${
    route.params.year
  }`,
});

definePageMeta({
  breadcrumb(route: RouteLocationNormalizedLoaded): Breadcrumb[] {
    const { year, month } = route.params as { year: string; month: string };
    return [
      { label: "Home", to: { name: "index" } },
      { label: year, to: { name: "year", params: { year: year } } },
      { label: month },
    ];
  },
});

const { year, month } = route.params as { year: string; month: string };

const isCurrentMonth = computed(() => {
  const currentDate = dayjs.utc();
  const date = dayjs.utc(`${year}-${capitalize(month)}-01`, "YYYY-MMMM-DD");
  const endTime = date.endOf("month");

  return endTime.isAfter(currentDate);
});

const { data: messages } = await useFetch<Message[]>(
  `/api/messages/${year}/${month}`
);

const { twitchUsername } = useRuntimeConfig().public;
const { db } = useFirebase();
onMounted(async () => {
  const date = dayjs.utc(`${year}-${capitalize(month)}-01`, "YYYY-MMMM-DD");
  const startTime = date.startOf("month").valueOf().toString();
  const endTime = date.endOf("month").valueOf().toString();

  if (!isCurrentMonth.value) return;

  const q = query(
    collection(db, "messages"),
    where("sentAt", ">=", startTime),
    where("sentAt", "<=", endTime),
    where("username", "==", twitchUsername)
  );

  onSnapshot(q, (querySnapshot) => {
    if (querySnapshot.docs.length === 0) return;
    messages.value = querySnapshot.docs.map((doc) => doc.data() as Message);
  });
});

const { fetchEmotes } = useEmotes();
const { fetchBadges } = useBadges();

fetchEmotes();
await fetchBadges();

const sortStore = useSortStore();
const { sortOrder } = storeToRefs(sortStore);

const sortedMessages = computed(() => {
  return messages?.value?.sort((a, b) => {
    if (sortOrder.value.message === "asc") {
      return parseInt(a.sentAt) - parseInt(b.sentAt);
    }

    return parseInt(b.sentAt) - parseInt(a.sentAt);
  });
});
</script>

<template>
  <section>
    <div v-if="messages && messages.length !== 0">
      <SimpleList :items="sortedMessages" v-slot="{ item }: { item: Message }">
        <Message :message="item" />
      </SimpleList>
    </div>

    <div v-else class="p-8 text-center text-5xl md:text-8xl">
      <h1>No Messages Found</h1>
    </div>
  </section>
</template>

<style scoped></style>
