<script setup lang="ts">
import type { Unsubscribe } from 'firebase/firestore'
import type { Message } from '@/types'
import {
  collection,
  onSnapshot,
  query,
  where,
} from 'firebase/firestore'

const { fetchEmotes, parseEmotes } = useEmotes()
const { fetchBadges, parseBadges } = useBadges()

fetchEmotes()
fetchBadges()

const { data: messages, status } = await useFetch<Message[]>('/api/messages/latest', {
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

watch(status, async (newStatus) => {
  if (newStatus !== 'success')
    return

  const latestMessage = messages.value?.at(0)

  if (!latestMessage)
    return

  const dayOfLatestMessage = getDayOfLatestMessage(Number.parseInt(latestMessage.sentAt))

  const latestMessagesQuery = query(
    collection(db, 'messages'),
    where('username', '==', twitchUsername),
    where('sentAt', '>=', dayOfLatestMessage),
  )

  unsub.value = onSnapshot(latestMessagesQuery, (querySnapshot) => {
    messages.value = querySnapshot.docs.map(doc => doc.data() as Message)
  })
}, { immediate: true })

onUnmounted(() => {
  if (!unsub.value)
    return
  unsub.value()
})
</script>

<template>
  <section>
    <div v-if="status === 'pending'">
      <LazySimpleListSkeleton :rows="10" />
    </div>

    <div v-else-if="sortedMessages && sortedMessages.length !== 0" class="flex flex-col">
      <SimpleList>
        <SimpleListItem v-for="message in sortedMessages" :key="message.id">
          <Message
            v-if="!message.reply"
            :sent-at="message.sentAt"
            sent-at-format="MMM DD hh:mm A z"
            :display-name="message.displayName"
            :color="message.color"
            :message="parseEmotes(message.message)"
            :badges="parseBadges(message.badges)"
          />

          <Message
            v-else
            :sent-at="message.sentAt"
            sent-at-format="MMM DD hh:mm A z"
            :display-name="message.displayName"
            :color="message.color"
            :message="parseEmotes(message.message)"
            :badges="parseBadges(message.badges)"
            :reply-message="parseEmotes(message.reply.parent.msgBody)"
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
