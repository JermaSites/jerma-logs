<script setup>
import TheHeader from "./components/TheHeader.vue";
</script>

<template>
  <div class="bg-slate-700 min-h-screen text-slate-200">
    <TheHeader />
    <main class="container mx-auto px-2 md:max-w-6xl">
      <router-view />
    </main>
    <section>
      <div class="p-6 text-center">
        Message me on Discord for any issues at
        <div class="inline-block">
          <a
            href="https://discordapp.com/users/178211447350886401"
            class="hover:underline"
            >Modus Pwnens</a
          >
        </div>
      </div>
    </section>
  </div>
</template>
