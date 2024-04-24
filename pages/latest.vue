<script setup lang="ts">
import {
  type Unsubscribe,
  collection,
  onSnapshot,
  query,
  where,
} from 'firebase/firestore'

import type { Breadcrumb, Message } from '@/types'

const dayjs = useDayjs()

useServerSeoMeta({
  title: 'Jerma Logs | Latest',
  ogTitle: 'Jerma Logs',
})

useSeoMeta({
  title: 'Jerma Logs | Latest',
  ogTitle: 'Jerma Logs',
})

definePageMeta({
  breadcrumb: [
    {
      label: 'Home',
      to: { name: 'index' },
    },
    {
      label: 'Latest',
    },
  ] as Breadcrumb[],
})

const { fetchEmotes, parseEmotes } = useEmotes()
const { fetchBadges, parseBadges } = useBadges()

fetchEmotes()
fetchBadges()

const { data: messages } = await useFetch<Message[]>('/api/messages/latest', {
  lazy: true,
})

const sortStore = useSortStore()
const { sortOrder } = storeToRefs(sortStore)

const sortedMessages = computed(() => {
  return messages?.value?.toSorted((a, b) => {
    if (sortOrder.value.latest === 'asc')
      return Number.parseInt(a.sentAt) - Number.parseInt(b.sentAt)

    return Number.parseInt(b.sentAt) - Number.parseInt(a.sentAt)
  })
})

const { db } = useFirebase()
const { twitchUsername } = useRuntimeConfig().public
const unsub = ref<Unsubscribe>()

onMounted(async () => {
  const latestMessage = messages.value?.at(-1)

  if (!latestMessage)
    return

  const dayOfLatestMessage = dayjs
    .utc(Number.parseInt(latestMessage.sentAt))
    .subtract(1, 'day')
    .valueOf()
    .toString()

  const latestMessagesQuery = query(
    collection(db, 'messages'),
    where('username', '==', twitchUsername),
    where('sentAt', '>=', dayOfLatestMessage),
  )

  unsub.value = onSnapshot(latestMessagesQuery, (querySnapshot) => {
    messages.value = querySnapshot.docs.map(doc => doc.data() as Message)
  })
})

onUnmounted(() => {
  if (!unsub.value)
    return
  unsub.value()
})
</script>

<template>
  <section>
    <div v-if="sortedMessages && sortedMessages.length !== 0" class="flex flex-col">
      <SimpleList>
        <SimpleListItem v-for="message in sortedMessages" :key="message.id">
          <Message
            :sent-at="message.sentAt" :display-name="message.displayName" :color="message.color"
            :message="parseEmotes(message.message)" :badges="parseBadges(message.badges)"
          />
        </SimpleListItem>
      </SimpleList>
    </div>

    <div v-else class="p-8 text-center text-5xl md:text-8xl">
      <h1>No Messages Found</h1>
    </div>
  </section>
</template>

<style scoped></style>
