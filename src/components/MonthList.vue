<script setup>
import { reactive, computed } from "vue";
import { useRoute } from "vue-router";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

const props = defineProps({
  sortOrder: String,
});

const route = useRoute();

const months = reactive([]);

const collectionPath = `messagesByYear/${route.params.year}/messagesByMonth`;
const querySnapshot = await getDocs(collection(db, collectionPath));
querySnapshot.forEach((doc) => {
  months.push(doc.id);
});

const sortedMonths = computed(() => {
  const orderedMonths = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  if (props.sortOrder === "asc") {
    return months
      .slice(0)
      .sort((b, a) => orderedMonths.indexOf(b) - orderedMonths.indexOf(a));
  }

  return months
    .slice(0)
    .sort((a, b) => orderedMonths.indexOf(b) - orderedMonths.indexOf(a));
});
</script>

<template>
  <ul>
    <li
      v-for="month in sortedMonths"
      :key="month"
      class="odd:bg-slate-900 even:bg-slate-800"
    >
      <router-link
        :to="{ name: 'Messages', params: { month: month } }"
        class="block p-4"
      >
        {{ month }}
      </router-link>
    </li>
  </ul>
</template>
