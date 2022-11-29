<script setup>
import logoUrl from "../assets/images/logo.png";
</script>

<template>
  <header class="bg-slate-900">
    <div class="container mx-auto p-4 md:max-w-6xl">
      <router-link :to="{ name: 'Home' }" class="flex items-center">
        <img :src="logoUrl" width="128" height="128" alt="Jerma Logs Logo" />

        <h1 class="text-slate-200 text-5xl ml-6">Jerma Logs</h1>
      </router-link>
    </div>
  </header>
</template>
