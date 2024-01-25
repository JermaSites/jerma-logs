<script setup lang="ts"></script>

<template>
  <header class="bg-slate-300 dark:bg-slate-900">
    <div class="container mx-auto p-4 md:max-w-6xl">
      <NuxtLink :to="{ name: 'index' }" class="flex items-center">
        <NuxtImg
          src="/logo.png"
          width="128"
          height="127"
          alt="Jerma Logs Logo"
          preload
        />

        <h1 class="ml-6 text-5xl">Jerma Logs</h1>
      </NuxtLink>
    </div>
  </header>
</template>
