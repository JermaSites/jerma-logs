<script setup>
import logoUrl from "../assets/images/logo.png";
</script>

<template>
  <header class="bg-slate-900">
    <div class="container flex mx-auto items-center p-4">
      <img :src="logoUrl" alt="Jerma Logs Logo" />
      <h1 class="ml-6 text-slate-200 text-5xl">Jerma Logs</h1>
    </div>
  </header>
</template>
