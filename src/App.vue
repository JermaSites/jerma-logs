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
        Message me on Discord for any issues (<a
          href="https://discordapp.com/users/Modus%20Pwnens#9109"
          class="text-blue-400 hover:underline"
          >Modus Pwnens#9109</a
        >)
      </div>
    </section>
  </div>
</template>
