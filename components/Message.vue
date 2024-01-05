<script setup lang="ts">
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import relativeTime from "dayjs/plugin/relativeTime";
import advancedFormat from "dayjs/plugin/advancedFormat";

dayjs.extend(timezone);
dayjs.extend(relativeTime);
dayjs.extend(advancedFormat);

import type { Message } from "@/types";

type Props = {
  message: Message;
};

const props = defineProps<Props>();

const settingsStore = useSettingsStore();

const { hideMessageTimestamps } = storeToRefs(settingsStore);

const messageSentAt = computed(() => {
  return dayjs(parseInt(props.message.sentAt)).format("MMM Do hh:mm A z");
});

const messageSentAtTimeAgo = computed(() => {
  return dayjs(parseInt(props.message.sentAt)).fromNow();
});

const messageColor = computed(() => {
  const colorMode = useColorMode();
  const hex = props.message.color;

  let r = parseInt("0x" + hex[1] + hex[2]);
  let g = parseInt("0x" + hex[3] + hex[4]);
  let b = parseInt("0x" + hex[5] + hex[6]);

  r /= 255;
  g /= 255;
  b /= 255;

  let cmin = Math.min(r, g, b),
    cmax = Math.max(r, g, b),
    delta = cmax - cmin,
    h = 0,
    s = 0,
    l = 0;

  if (delta == 0) h = 0;
  else if (cmax == r) h = ((g - b) / delta) % 6;
  else if (cmax == g) h = (b - r) / delta + 2;
  else h = (r - g) / delta + 4;

  h = Math.round(h * 60);

  if (h < 0) h += 360;

  l = (cmax + cmin) / 2;
  s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
  s = +(s * 100).toFixed(1);
  l = +(l * 100).toFixed(1);

  if (colorMode.value === "light") {
    l -= 15;
  }

  return "hsl(" + h + "," + s + "%," + l + "%)";
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
        <img
          v-for="badge in badges"
          :key="badge.name"
          :src="badge.url"
          :alt="badge.name"
          :title="badge.name"
          class="mr-1 inline-block"
          width="18"
          height="18"
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
