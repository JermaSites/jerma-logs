<script setup lang="ts">
import type { Message } from '@/types'

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

const settingsStore = useSettingsStore()

const dayjs = useDayjs()

onMounted(() => {
  settingsStore.userTimezone = dayjs.tz.guess()
})

const msgStore = useMessageStore()

const { data: lastMessage } = await useFetch<Message>('/api/messages/latest/lastMessage')

msgStore.dateOfLatestMessage = lastMessage?.value?.sentAt
</script>

<template>
  <UApp>
    <NuxtLoadingIndicator />

    <SiteHeader hydrate-never class="mb-4" />

    <main class="container mx-auto px-4 md:max-w-6xl">
      <div class="flex justify-between">
        <SiteBreadcrumb />
        <SiteSettings />
      </div>
      <slot />
    </main>
    <LazySiteFooter hydrate-never />
  </UApp>
</template>

<style>
:root {
  font-family: "Roboto", sans-serif;
}
</style>
