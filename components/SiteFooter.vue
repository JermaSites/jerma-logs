<script setup lang="ts">
import { version } from "../package.json";
</script>

<template>
  <footer>
    <div class="p-6 text-center">
      Message me on Discord for any issues
      <div class="inline-block">
        <a
          href="https://discordapp.com/users/178211447350886401"
          class="text-sky-600 underline dark:text-blue-400"
          >Modus Pwnens</a
        >
      </div>
    </div>
    <div class="text-center inset-x-0 bottom-0 text-slate-500">
      v{{ version }}
    </div>
  </footer>
</template>

<style scoped></style>
