<script setup lang="ts">
const props = defineProps<{
  sentAt: string
  displayName: string
  color: string
  message: string
  replyMessage: string
  badges: {
    name: string
    url: string
  }[]
}>()

const settingsStore = useSettingsStore()
const dayjs = useDayjs()

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

const formattedMessage = computed(() => {
  const splitMsg = props.message.split(' ')
  splitMsg.shift()
  return splitMsg.join(' ')
})
</script>

<template>
  <div class="md:grid gap-1 grid-cols-[max-content_max-content_auto] p-4">
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
      <span :style="{ color: messageColor }" class="font-bold" data-testid="display-name">{{ displayName }}</span>:
    </div>
    <div>
      <div class="inline-flex justify-center items-center bg-slate-950 p-1.5 text-sm italic">
        <UIcon name="heroicons-solid:reply" class="size-4 mr-1 center" />
        <span class="text-slate-400">Replying to:</span>
        <span class="ml-1">{{ replyMessage }}</span>
      </div>
      <div class="ml-4" data-testid="message" v-html="formattedMessage" />
    </div>
  </div>
</template>

<style scoped></style>
