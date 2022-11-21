<script setup>
import { onUpdated, computed } from "vue";
import Message from "./Message.vue";

const props = defineProps({
  messages: Array,
  sortOrder: String,
});

const sortedMessages = computed(() => {
  if (props.sortOrder === "asc") {
    return props.messages.sort((a, b) => {
      return +a.sentAt - +b.sentAt;
    });
  }

  return props.messages.sort((a, b) => {
    return +b.sentAt - +a.sentAt;
  });
});
</script>

<template>
  <ul>
    <li
      v-for="message in sortedMessages"
      :key="message.id"
      class="odd:bg-slate-900 even:bg-slate-800 p-4 flex"
    >
      <Message :message="message" />
    </li>
  </ul>
</template>
