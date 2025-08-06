<script setup lang="ts">
useHead({
  bodyAttrs: {
    class:
      'min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-700 dark:text-slate-200',
  },
})

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

try {
  await Promise.allSettled([fetchEmotes(), fetchBadges()])
}
catch (error) {
  console.error('Failed to load initial data:', error)
}

onMounted(() => {
  settingsStore.colorModeValue = colorMode.value
  settingsStore.userTimezone = dayjs.tz.guess()
})

const { data: lastMessage } = await useFetch<Message>('/api/messages/latest/lastMessage')

unreadStore.dateOfLatestMessage = lastMessage?.value?.sentAt ?? ''
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

<style>
:root {
  font-family: "Roboto", sans-serif;
}
</style>
