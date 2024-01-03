<script setup lang="ts">
useHead({
  bodyAttrs: {
    class:
      "min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-700 dark:text-slate-200",
  },
});

useServerSeoMeta({
  description: "Jerma985's twitch chat logs",
  ogDescription: "Jerma985's twitch chat logs",
  ogImage: "https://logs.jerma.io/logo.png",
  twitterCard: "summary",
});
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

<style></style>
