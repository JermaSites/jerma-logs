<script setup lang="ts">
useHead({
  htmlAttrs: {
    lang: 'en',
  },
  bodyAttrs: {
    class:
      'min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-700 dark:text-slate-200',
  },
  link: [
    {
      rel: 'icon',
      type: 'image/png',
      href: '/logo.png',
    },
  ],
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
</script>

<template>
  <NuxtLoadingIndicator />

  <SiteHeader class="mb-4" />

  <main class="container mx-auto px-4 md:max-w-6xl">
    <slot />
  </main>
  <SiteFooter />
</template>

<style>
:root {
  font-family: "Roboto", sans-serif;
}
</style>
