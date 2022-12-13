<script setup>
import { reactive, computed } from "vue";
import { useRoute } from "vue-router";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import dayjs from "dayjs";

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

const months = computed(() => {
  const currentMonth = dayjs().month();
  return orderedMonths.slice(0, currentMonth + 1);
});

// const route = useRoute();

// const months = reactive([]);

// const collectionPath = `messagesByYear/${route.params.year}/messagesByMonth`;
// const querySnapshot = await getDocs(collection(db, collectionPath));
// querySnapshot.forEach((doc) => {
//   months.push(doc.id);
// });

const sortedMonths = computed(() => {
  if (props.sortOrder === "asc") {
    return months.value.slice();
  }

  return months.value.slice().reverse();
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
