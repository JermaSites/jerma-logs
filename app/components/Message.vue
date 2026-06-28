<script setup lang="ts">
const props = defineProps<{
  sentAt: string
  sentAtFormat: string
  displayName: string
  color: string
  message: string
  replyMessage?: string
  badges: {
    name: string
    url: string
  }[]
  unread?: boolean
}>()

const { dayjs } = useDayjs()
const settingsStore = useSettingsStore()
const colorMode = useColorMode()

const { hideMessageTimestamps } = storeToRefs(settingsStore)

const messageSentAt = computed(() => {
  return dayjs.tz(Number.parseInt(props.sentAt)).format(props.sentAtFormat)
})

const messageSentAtTimeAgo = computed(() => {
  return dayjs.tz(Number.parseInt(props.sentAt)).fromNow()
})

const messageColor = computed(() => {
  return dynamicHue(props.color, colorMode.value)
})
</script>

<template>
  <div
    class="grid gap-1 md:grid-cols-[max-content_max-content_auto_min-content] relative p-4"
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
          placeholder
        />
      </span>
      <span :style="{ color: messageColor }" class="font-bold" data-testid="display-name">
        {{ displayName }} </span>:
    </div>
    <div>
      <div v-if="replyMessage" class="inline-flex bg-slate-100 shadow dark:bg-slate-950 p-1.5 text-sm italic">
        <div class="flex text-slate-500 dark:text-slate-400 whitespace-nowrap">
          <UIcon name="heroicons-solid:reply" class="size-4 mr-1" />
          Replying to:
        </div>
        <div class="ml-1" v-html="replyMessage" />
      </div>
      <div :class="replyMessage ? 'ml-1.5 mt-1.5' : ''" data-testid="message" v-html="message" />
    </div>

    <div class="absolute md:static top-2 right-2">
      <UBadge v-if="unread" color="info">
        New
      </UBadge>
    </div>
  </div>
</template>
