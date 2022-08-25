<script setup>
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/vue/24/solid";

function scrollToTop() {
  window.scroll({
    top: 0,
    left: 0,
    behavior: "smooth",
  });
}

function scrollToBottom() {
  window.scroll({
    top: document.body.scrollHeight,
    left: 0,
    behavior: "smooth",
  });
}
</script>

<template>
  <div class="fixed z-90 bottom-6 right-6 flex flex-col gap-5">
    <button
      @click="scrollToTop"
      class="bg-slate-800 w-14 h-14 rounded-full flex justify-center items-center border-2 border-slate-500 drop-shadow-md"
    >
      <ChevronUpIcon class="w-6 text-blue-500 bg-slate-800" />
    </button>

    <button
      @click="scrollToBottom"
      class="bg-slate-800 w-14 h-14 rounded-full flex justify-center items-center border-2 border-slate-500 drop-shadow-md"
    >
      <ChevronDownIcon class="w-6 text-blue-500 bg-slate-800" />
    </button>
  </div>
</template>

<style lang="scss" scoped></style>
