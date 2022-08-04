<script setup>
defineProps({
  size: {
    type: Number,
    default: 0,
    validator(value) {
      return value >= 0;
    },
  },
});
</script>

<template>
  <ul>
    <li v-for="i in size" :key="i" class="odd:bg-slate-900 even:bg-slate-800">
      <div class="block p-4 animate-pulse">
        <div class="h-4 bg-cyan-400 rounded-full"></div>
      </div>
    </li>
  </ul>
</template>
