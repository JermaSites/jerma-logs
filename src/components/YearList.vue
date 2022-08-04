<script setup>
import { reactive, computed } from "vue";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

const props = defineProps({
  sortOrder: String,
});

const years = reactive([]);

const querySnapshot = await getDocs(collection(db, "messagesByYear"));
querySnapshot.forEach((doc) => {
  const { year } = doc.data();
  years.push(year);
});

const sortedYears = computed(() => {
  if (props.sortOrder === "asc") {
    return years.sort();
  } else {
    return years.reverse();
  }
});
</script>

<template>
  <ul>
    <li
      v-for="year in sortedYears"
      :key="year"
      class="odd:bg-slate-900 even:bg-slate-800"
    >
      <router-link
        :to="{ name: 'Months', params: { year: year } }"
        class="block p-4"
      >
        {{ year }}
      </router-link>
    </li>
  </ul>
</template>
