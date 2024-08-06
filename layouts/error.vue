<script setup lang="ts">
useHead({
  bodyAttrs: {
    class:
      'min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-700 dark:text-slate-200',
  },
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
