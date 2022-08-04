<script setup>
import { computed } from "vue";
import _ from "lodash";
import Message from "./Message.vue";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";

dayjs.extend(advancedFormat);

const props = defineProps({
  messages: Array,
  chrono: Boolean,
});

function formatDate(date) {
  return dayjs(date).format("dddd, MMMM Do YYYY");
}

const seperatedMessages = computed(() => {
  const groupedMessages = _.groupBy(props.messages, (msg) => {
    return dayjs(+msg.sentAt).startOf("day");
  });

  if (props.chrono) {
    for (const property in groupedMessages) {
      groupedMessages[property] = _.orderBy(
        groupedMessages[property],
        "sentAt",
        "asc"
      );
    }
  } else {
    for (const property in groupedMessages) {
      groupedMessages[property] = _.orderBy(
        groupedMessages[property],
        "sentAt",
        "desc"
      );
    }
  }

  return groupedMessages;
});
</script>

<template>
  <section v-for="(messages, i) in seperatedMessages" :key="i" class="">
    <div
      class="bg-emerald-600 text-slate-200 p-4 font-bold sticky top-20 border-b-2 border-emerald-400"
    >
      {{ formatDate(i) }}
    </div>
    <ul>
      <li
        v-for="message in messages"
        :key="message.id"
        class="odd:bg-slate-900 even:bg-slate-800 p-4 flex"
      >
        <Message :message="message" />
      </li>
    </ul>
  </section>
</template>
