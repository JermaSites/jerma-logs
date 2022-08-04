<script setup>
import Message from "./Message.vue";

const props = defineProps({
  messages: Array,
});
</script>

<template>
  <ul>
    <li
      v-for="message in messages"
      :key="message.id"
      class="odd:bg-slate-900 even:bg-slate-800 p-4 flex"
    >
      <Message :message="message" />
    </li>
  </ul>
</template>
