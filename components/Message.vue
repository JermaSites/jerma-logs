<script setup lang="ts">
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";
import relativeTime from "dayjs/plugin/relativeTime";
import advancedFormat from "dayjs/plugin/advancedFormat";
import dynamicHue from "~/utils/dynamicHue";
import type { Message } from "@/types";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);
dayjs.extend(advancedFormat);

type Props = {
  message: Message;
};

const props = defineProps<Props>();

const settingsStore = useSettingsStore();

const { hideMessageTimestamps, colorModeValue, userTimezone } =
  storeToRefs(settingsStore);

dayjs.tz.setDefault(userTimezone.value);

const messageSentAt = computed(() => {
  return dayjs.tz(parseInt(props.message.sentAt)).format("MMM Do hh:mm A z");
});

const messageSentAtTimeAgo = computed(() => {
  return dayjs.tz(parseInt(props.message.sentAt)).fromNow();
});

const messageColor = computed(() => {
  const hex = props.message.color;
  return dynamicHue(hex, colorModeValue.value);
});

const { parseEmotes } = useEmotes();

const parsedEmotes = computed(() => parseEmotes(props.message.message));

const { parseBadges } = useBadges();

const badges = computed(() => parseBadges(props.message.badges));
</script>

<template>
  <div
    class="grid w-full gap-1 p-4 md:grid-cols-[max-content_max-content_auto]"
  >
    <div :title="messageSentAtTimeAgo" class="font-mono">
      <span v-show="!hideMessageTimestamps">[{{ messageSentAt }}]</span>
    </div>

    <div>
      <span>
        <NuxtImg
          v-for="badge in badges"
          :key="badge.name"
          :src="badge.url"
          :alt="badge.name"
          :title="badge.name"
          class="mr-1 inline-block"
          width="18"
          height="18"
          loading="lazy"
          placeholder
        />
      </span>
      <span :style="{ color: messageColor }" class="font-bold">
        {{ message.displayName }} </span
      >:
    </div>
    <div v-html="parsedEmotes"></div>
  </div>
</template>

<style scoped></style>
