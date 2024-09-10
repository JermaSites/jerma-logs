<script setup lang="ts">
const dayjs = useDayjs()

useHead({
  bodyAttrs: {
    class:
      'min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-700 dark:text-slate-200',
  },
})

useSeoMeta({
  title: 'Jerma Logs',
  description: 'Jerma985\'s twitch chat logs',
  ogTitle: 'Jerma Logs',
  ogDescription: 'Jerma985\'s twitch chat logs',
  ogImage: 'https://logs.jerma.io/logo.png',
  ogUrl: 'https://logs.jerma.io',
  twitterTitle: 'Jerma Logs',
  twitterDescription: 'Jerma985\'s twitch chat logs',
  twitterImage: 'https://logs.jerma.io/logo.png',
  twitterCard: 'summary',
})

const settingsStore = useSettingsStore()

onMounted(() => {
  settingsStore.userTimezone = dayjs.tz.guess()
})
</script>

<template>
  <NuxtLoadingIndicator />

  <SiteHeader class="mb-4" />

  <main class="container mx-auto px-4 md:max-w-6xl">
    <div class="flex justify-between">
      <SiteBreadcrumb />
      <SiteSettings />
    </div>
    <slot />
  </main>
  <SiteFooter />
</template>

<style>
:root {
  font-family: "Roboto", sans-serif;
}
</style>
