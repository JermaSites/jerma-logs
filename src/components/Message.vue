<script setup>
import { computed } from "vue";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import advancedFormat from "dayjs/plugin/advancedFormat";
import { useSettings } from "../store/settings";

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(advancedFormat);

const tzGuess = dayjs.tz.guess();
dayjs.tz.setDefault(tzGuess);

const props = defineProps({
  message: Object,
});

const settings = useSettings();

const messageSentAt = computed(() => {
  const sentAt = +props.message.sentAt;
  return dayjs(sentAt).format("MMM Do hh:mm A z");
});

const messageSentAtTimeAgo = computed(() => {
  const sentAt = +props.message.sentAt;
  return dayjs(sentAt).fromNow();
});
</script>

<template>
  <div class="grid md:grid-cols-[max-content_max-content_auto] gap-1 w-full">
    <div
      v-if="settings.timestamps"
      :title="messageSentAtTimeAgo"
      class="font-mono"
    >
      [{{ messageSentAt }}]
    </div>
    <div v-else></div>
    <div>
      <span>
        <img
          v-for="badge in message.badgeURLS"
          :src="badge.url"
          :alt="badge.name"
          :title="badge.name"
          class="inline-block mr-1"
          width="18"
          height="18"
        />
      </span>
      <span :style="{ color: message.color }" class="font-bold">
        {{ message.displayName }} </span
      >:
    </div>
    <div v-html="message.message"></div>
  </div>
</template>
