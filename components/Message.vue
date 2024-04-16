<script setup lang="ts">
const props = defineProps<Props>()

const dayjs = useDayjs()

interface Props {
  sentAt: string
  displayName: string
  color: string
  message: string
  badges: {
    name: string
    url: string
  }[]
}

const settingsStore = useSettingsStore()

const { hideMessageTimestamps, colorModeValue, userTimezone }
  = storeToRefs(settingsStore)

dayjs.tz.setDefault(userTimezone.value)

const messageSentAt = computed(() => {
  return dayjs.tz(Number.parseInt(props.sentAt)).format('MMM Do hh:mm A z')
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
        {{ displayName }} </span>:
    </div>
    <div v-html="message" />
  </div>
</template>

<style scoped></style>
