<script setup>
import Breadcrumb from "../components/Breadcrumb.vue";
import SortAndSettings from "../components/SortAndSettings.vue";
</script>

<template>
  <div
    class="flex justify-between items-center sticky bg-slate-700 z-10 top-0 h-20"
  >
    <div class="bg-slate-800 rounded-md p-4">
      <Breadcrumb />
    </div>

    <div class="bg-slate-800 rounded-md">
      <SortAndSettings />
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
