<script setup>
import { useWindowScroll } from "@vueuse/core";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/vue/24/solid";
import { ref, watch } from "vue";

const { y } = useWindowScroll();

const showFab = ref(false);
const showFabTimeout = ref(null);

watch(y, () => {
  showFab.value = true;

  if (showFabTimeout.value) {
    clearTimeout(showFabTimeout.value);
  }

  showFabTimeout.value = setTimeout(() => {
    console.log("setTimeout");
    showFab.value = false;
  }, 3000);
});

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
  <Transition>
    <div v-if="showFab" class="fixed z-90 bottom-6 right-6 flex flex-col gap-5">
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
  </Transition>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
