<script setup lang="ts">
const error = useError()

function handleError() {
  clearError({
    redirect: '/',
  })
}
</script>

<template>
  <NuxtLayout name="error">
    <div class="text-center">
      <h1 class="text-9xl">
        {{ error.statusCode }}
      </h1>
      <h2 class="text-6xl">
        {{ error.message }}
      </h2>

      <button class=" border-slate-200 bg-slate-800 hover:bg-slate-900 font-bold tracking-wide p-4 mt-4" @click="handleError">
        Return to Home
      </button>
    </div>
  </NuxtLayout>
</template>

<style scoped>

</style>
