<script setup></script>

<template>
  <div
    class="flex justify-between items-center sticky bg-slate-700 z-10 top-0 h-20"
  >
    <slot />
    <div class="bg-slate-800 rounded-md">
      <slot name="nav"></slot>
    </div>
    <div class="bg-slate-800 rounded-md">
      <slot name="settings"></slot>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
