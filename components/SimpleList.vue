<script setup lang="ts">
// type Props = {
//   items: Array<any>;
//   itemKey: string;
// };

// defineProps<Props>();
</script>

<template>
  <ul>
    <slot />
    <!-- <li
      v-for="item in items"
      :key="item[itemKey]"
      class="odd:bg-slate-300 even:bg-slate-200 dark:odd:bg-slate-900 dark:even:bg-slate-800"
    >
      <slot :item="item" />
    </li> -->
  </ul>
</template>
