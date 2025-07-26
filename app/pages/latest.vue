<script setup lang="ts">
const { dayjs } = useDayjs()
const { fetchEmotes, parseEmotes } = useEmotes()
const { fetchBadges, parseBadges } = useBadges()

const sortStore = useSortStore()
const { sortOrder } = storeToRefs(sortStore)

const unreadStore = useUnreadStore()
const { dateOfLastReadMessage, latestMessageIndex } = storeToRefs(unreadStore)

const { messages, getLatestMessages } = useMessages()

fetchEmotes()
fetchBadges()

const { data, status } = await useFetch<Message[]>('/api/messages/latest', {
  server: false,
  lazy: true,
  default() {
    return []
  },
})

const hasMessages = computed(() => messages.value.length > 0)
const isLoading = computed(() => status.value === 'idle' || status.value === 'pending')

const lastReadMessageTimestamp = dateOfLastReadMessage.value
const latestMessageIndexTimestamp = latestMessageIndex.value

watch(data, (msg) => {
  messages.value = msg

  const firstMessage = msg.at(0)
  const lastMessage = msg.at(-1)

  latestMessageIndex.value = firstMessage?.sentAt ?? ''
  dateOfLastReadMessage.value = lastMessage?.sentAt ?? ''

  if (lastMessage) {
    const unsubscribe = getLatestMessages(lastMessage.sentAt)

    onWatcherCleanup(unsubscribe)
  }
})

const sortedMessages = computed(() => {
  return messages.value.toSorted((a, b) => {
    const aTime = Number.parseInt(a.sentAt)
    const bTime = Number.parseInt(b.sentAt)

    return sortOrder.value.latest === 'asc'
      ? aTime - bTime
      : bTime - aTime
  })
})

function isUnread(sentAt: string) {
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
            :unread="isUnread(message.sentAt)"
          />
        </SimpleListItem>
      </SimpleList>
    </div>

    <div v-else class="p-8 text-center text-5xl md:text-8xl">
      <h1>No Messages Found</h1>
    </div>
  </section>
</template>
