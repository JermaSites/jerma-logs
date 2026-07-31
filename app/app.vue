<script setup lang="ts">
useSeoMeta({
  ogImage: 'https://logs.jerma.io/logo.png',
  twitterCard: 'summary',
})

const { dayjs } = useDayjs()
const settingsStore = useSettingsStore()
const unreadStore = useUnreadStore()
const colorMode = useColorMode()

const { fetchEmotes } = useEmotes()
const { fetchBadges } = useBadges()

// Kept out of useFetch/useAsyncData on purpose: these two responses are ~500kB
// combined, and the API caches them for 24h, so letting the browser fetch and
// cache them beats inlining them into every SSR payload. allSettled so a
// failing emote/badge API never takes the whole page down.
const [{ data: lastMessage }] = await Promise.all([
  useFetch<Message | null>('/api/messages/latest/lastMessage'),
  Promise.allSettled([fetchEmotes(), fetchBadges()]),
])

unreadStore.dateOfLatestMessage = lastMessage.value?.sentAt ?? ''

onMounted(() => {
  settingsStore.colorModeValue = colorMode.value
  settingsStore.userTimezone = dayjs.tz.guess()
})
</script>

<template>
  <UApp>
    <NuxtLoadingIndicator />

    <LazySiteHeader hydrate-never class="mb-4" />

    <main class="container mx-auto px-4 md:max-w-6xl">
      <div class="flex justify-between">
        <SiteBreadcrumb />
        <SiteSettings />
      </div>
      <NuxtPage />
    </main>
    <LazySiteFooter hydrate-never />
  </UApp>
</template>
