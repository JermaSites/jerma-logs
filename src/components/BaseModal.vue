<script setup>
import { ref, watch } from "vue";
import { onClickOutside } from "@vueuse/core";

const modal = ref(null);
const open = ref(false);

onClickOutside(modal, () => (open.value = false));

function close() {
  open.value = false
}
</script>

<template>
  <div @click="open = true">
    <slot name="activator" />
  </div>
  <Teleport to="#app">
    <div
      v-if="open"
      class="fixed top-0 left-0 flex justify-center items-center w-full h-full bg-blue-900/50 z-50"
    >
      <div ref="modal">
        <slot :close="close" />
      </div>
    </div>
  </Teleport>
</template>

<style lang="scss" scoped></style>
