<script setup>
import TheHeader from "./components/TheHeader.vue";
</script>

<template>
  <div class="bg-slate-700 min-h-screen text-slate-200">
    <TheHeader />
    <main class="container mx-auto px-2 md:max-w-6xl">
      <router-view />
    </main>
  </div>
</template>
