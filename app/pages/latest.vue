<script setup lang="ts">
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
  server: false,
  lazy: true,
})

const unreadStore = useUnreadStore()
const lastReadMessageTimestamp = unreadStore.dateOfLastReadMessage
const latestMessageIndexTimestamp = unreadStore.latestMessageIndex

unreadStore.latestMessageIndex = messages.value?.at(-1)?.sentAt ?? ''
unreadStore.dateOfLastReadMessage = messages.value?.at(0)?.sentAt ?? ''

const sortStore = useSortStore()
const { sortOrder } = storeToRefs(sortStore)

const sortedMessages = computed(() => {
  if (!messages.value)
    return []

  return messages.value.toSorted((a, b) => {
    const aTime = Number.parseInt(a.sentAt)
    const bTime = Number.parseInt(b.sentAt)

    return sortOrder.value.latest === 'asc'
      ? aTime - bTime
      : bTime - aTime
  })
})

const hasMessages = computed(() => messages.value != null && sortedMessages.value.length > 0)
const isLoading = computed(() => messages.value == null || status.value === 'pending')

const { firestore } = useFirebase()
const { twitchUsername } = useRuntimeConfig().public

watchEffect((onCleanup) => {
  if (status.value !== 'success' || !messages.value?.length)
    return

  const latestMessage = messages.value[0]
  if (!latestMessage)
    return

  const dayOfLatestMessage = getDayOfLatestMessage(Number.parseInt(latestMessage.sentAt))

  const latestMessagesQuery = query(
    collection(firestore, 'messages'),
    where('username', '==', twitchUsername),
    where('sentAt', '>=', dayOfLatestMessage),
  )

  const unsubscribe = onSnapshot(latestMessagesQuery, (querySnapshot) => {
    messages.value = querySnapshot.docs.map(doc => doc.data() as Message)
  })

  onCleanup(unsubscribe)
})

const { dayjs } = useDayjs()

function showAsUnread(sentAt: string) {
  if (!lastReadMessageTimestamp || !latestMessageIndexTimestamp)
    return false

  const messageTimestamp = Number.parseInt(sentAt)
  const lastReadTimestamp = Number.parseInt(lastReadMessageTimestamp)

  const messageIsUnread = dayjs(messageTimestamp).isAfter(dayjs(lastReadTimestamp))
  const latestMessagesHasBeenPreviouslyRead = unreadStore.latestMessageIndex === latestMessageIndexTimestamp

  return messageIsUnread && latestMessagesHasBeenPreviouslyRead
}
</script>

<template>
  <section>
    <div v-if="isLoading">
      <LazySimpleListSkeleton :rows="10" />
    </div>

    <div v-else-if="hasMessages" class="flex flex-col">
      <SimpleList>
        <SimpleListItem v-for="message in sortedMessages" :key="message.id">
          <Message
            :sent-at="message.sentAt"
            sent-at-format="MMM DD hh:mm A z"
            :display-name="message.displayName"
            :color="message.color"
            :message="parseEmotes(message.message)"
            :badges="parseBadges(message.badges)"
            :reply-message="parseEmotes(message?.reply?.parent?.msgBody || '')"
            :unread="showAsUnread(message.sentAt)"
          />
        </SimpleListItem>
      </SimpleList>
    </div>

    <div v-else class="p-8 text-center text-5xl md:text-8xl">
      <h1>No Messages Found</h1>
    </div>
  </section>
</template>
