<script setup>
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

const route = useRoute();

const props = defineProps({
  sortOrder: String,
});

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

const months = ref([]);

const collectionPath = `messagesByYear/${route.params.year}/messagesByMonth`;
const querySnapshot = await getDocs(collection(db, collectionPath));
querySnapshot.forEach((doc) => {
  months.value.push(doc.id);
});

const filteredMonths = computed(() => {
  return orderedMonths.filter(month => months.value.includes(month))
})

const sortedMonths = computed(() => {
  const monthsCopy = filteredMonths.value.slice()
  if (props.sortOrder === "desc") {
    return monthsCopy
  }
  return monthsCopy.reverse();
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
