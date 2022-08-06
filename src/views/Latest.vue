<script setup>
import { ref, computed } from "vue";
import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import NavBar from "../components/NavBar.vue";
import SortAndSettings from "../components/SortAndSettings.vue";
import dayjs from "dayjs";
import { useSettings } from "../store/settings";
import MessageListSimple from "../components/MessageListSimple.vue";
import MessageListSeperated from "../components/MessageListSeperated.vue";
import { useEmotes } from "../composables/emotes.js";
import { useBadges } from "../composables/badges.js";
import ScrollFab from "../components/ScrollFab.vue";

const layouts = {
  MessageListSimple,
  MessageListSeperated,
};

const settings = useSettings();

const { parseMessage } = await useEmotes();
const { parseBadges } = await useBadges();

function setSortOrder(order) {
  settings.latestSort = order;
}

const latestMessageQuery = query(
  collection(db, "messages"),
  orderBy("sentAt", "desc"),
  limit(1)
);

const latestMessageQuerySnapshot = await getDocs(latestMessageQuery);

const latestMessage = latestMessageQuerySnapshot.docs[0].data();

const latestMessagesDaySent = dayjs(+latestMessage.sentAt)
  .startOf("day")
  .valueOf();

const latestMessagesQuery = query(
  collection(db, "messages"),
  where("sentAt", ">=", latestMessagesDaySent.toString())
);

const latestMessagesQuerySnapshot = await getDocs(latestMessagesQuery);

const latestMessages = ref([]);

latestMessagesQuerySnapshot.forEach((doc) => {
  latestMessages.value.push(doc.data());
});

latestMessages.value = latestMessages.value
  .filter((msg) => msg.username !== "moduspwnens")
  .map((msg) => {
    msg.message = parseMessage(msg);
    msg.badgeURLS = parseBadges(msg);
    return msg;
  })
  .sort((a, b) => +b.sentAt - +a.sentAt);

const sortedMessages = computed(() => {
  if (settings.latestSort === "asc") {
    return latestMessages.value.sort((a, b) => +b.sentAt - +a.sentAt);
  }

  return latestMessages.value.sort((b, a) => +b.sentAt - +a.sentAt);
});
</script>

<template>
  <NavBar>
    <template #nav>
      <router-link
        :to="{ name: 'Home' }"
        class="text-sky-400 hover:underline pl-4 pr-2 py-4 inline-block"
      >
        Home
      </router-link>
      /
      <span class="pl-2 pr-4 py-4">Latest</span>
    </template>

    <template #settings>
      <SortAndSettings
        @sort-order="setSortOrder"
        :sort-order="settings.latestSort"
      />
    </template>
  </NavBar>

  <div class="pb-2">
    <component
      :is="layouts[settings.layout.componentName]"
      :messages="sortedMessages"
      :chrono="settings.layout.crono"
    ></component>
  </div>

  <ScrollFab v-if="settings.fab" />
</template>
