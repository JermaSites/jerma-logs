<script setup lang="ts">
import type { RendererElement, RendererNode } from 'vue'

const props = defineProps<{
  sentAt: string
  displayName: string
  color: string
  message: (string | VNode<RendererNode, RendererElement, { [key: string]: any }>)[]
  badges: {
    name: string
    url: string
  }[]
}>()

const dayjs = useDayjs()

const settingsStore = useSettingsStore()

const { hideMessageTimestamps, colorModeValue, userTimezone }
  = storeToRefs(settingsStore)

dayjs.tz.setDefault(userTimezone.value)

const messageSentAt = computed(() => {
  return dayjs.tz(Number.parseInt(props.sentAt)).format('MMM DD hh:mm A z')
})

const messageSentAtTimeAgo = computed(() => {
  return dayjs.tz(Number.parseInt(props.sentAt)).fromNow()
})

const messageColor = computed(() => {
  return dynamicHue(props.color, colorModeValue.value)
})
</script>

<template>
  <div
    class="md:grid gap-1 grid-cols-[max-content_max-content_auto] p-4"
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
      <span :style="{ color: messageColor }" class="font-bold" data-testid="display-name">
        {{ displayName }} </span>:
    </div>
    <!-- <div data-testid="message" v-html="message" /> -->
    <div>
      <span v-for="(token, index) in message" :key="index">
        <!-- Check if token is a string or a component -->
        <template v-if="typeof token === 'string'">{{ token }}</template>
        <template v-else><component :is="token" /></template>
      </span>
    </div>
  </div>
</template>

<style scoped></style>
