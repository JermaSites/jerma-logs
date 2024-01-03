<script setup lang="ts">
import type { Message } from "@/types";

const { data } = await useFetch<Message>("/api/sus");

const { fetchEmotes, parseEmotes } = useEmotes();

fetchEmotes();

const susRegExp = new RegExp(
  /^!(commands\s+edit|editcom)\s+(-cd=\d+\s+)?(!sus)\s+(-cd=\d+\s+)?(?<susMessage>.+)$/,
);

const formattedSusMessage = computed(() => {
  const sus = data.value?.message?.match(susRegExp)?.groups?.susMessage;

  if (sus === undefined) return "";

  return sus;
});

const parsedSusMessage = computed(() => parseEmotes(formattedSusMessage.value));
</script>

<template>
  <div class="text-center">
    <div class="bg-slate-300 px-4 py-2 dark:bg-slate-900">
      <h1 class="font-meduim text-xl">!SUS Message</h1>
    </div>
    <div class="bg-slate-200 p-4 dark:bg-slate-800">
      <p v-html="parsedSusMessage"></p>
    </div>
  </div>
</template>

<style scoped></style>
