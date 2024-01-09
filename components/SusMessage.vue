<script setup lang="ts">
import type { Message } from "@/types";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(utc);
dayjs.extend(relativeTime);

const { data } = await useFetch<Message>("/api/sus");

const { fetchEmotes, parseEmotes } = useEmotes();

fetchEmotes();

const susRegExp = new RegExp(
  /^!(commands\s+edit|editcom)\s+(-cd=\d+\s+)?(!sus)\s+(-cd=\d+\s+)?(?<susMessage>.+)$/
);

const formattedSusMessage = computed(() => {
  const sus = data.value?.message?.match(susRegExp)?.groups?.susMessage;

  if (sus === undefined) return "";

  return sus;
});

const parsedSusMessage = computed(() => parseEmotes(formattedSusMessage.value));

const susMessageTimeFromNow = computed(() => {
  const sentAt = data.value?.sentAt;

  if (sentAt === undefined) return "";

  return dayjs.utc(parseInt(sentAt)).fromNow();
});
</script>

<template>
  <div class="text-center">
    <div class="bg-slate-300 px-4 py-2 dark:bg-slate-900">
      <h1 class="font-meduim text-xl">!SUS Message</h1>
      <h2 class="text-lg text-slate-400">{{ susMessageTimeFromNow }}</h2>
    </div>
    <div class="bg-slate-200 p-4 dark:bg-slate-800">
      <p v-html="parsedSusMessage"></p>
    </div>
  </div>
</template>

<style scoped></style>
