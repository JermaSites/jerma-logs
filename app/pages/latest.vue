<script setup lang="ts">
const { dayjs } = useDayjs()

const sortStore = useSortStore()
const { sortOrder } = storeToRefs(sortStore)

const unreadStore = useUnreadStore()
const { dateOfLastReadMessage, latestMessageIndex } = storeToRefs(unreadStore)

const { getLatestMessages } = useMessages()

useSeoMeta({
  title: 'Latest Messages',
  description: 'The most recent messages Jerma985 has sent in twitch chat',
})

const { data: messages, status, error } = await useFetch<Message[]>('/api/messages/latest', {
  server: false,
  lazy: true,
  default: () => [],
})

const hasMessages = computed(() => messages.value.length > 0)
const isLoading = computed(() => status.value === 'idle' || status.value === 'pending')

// Snapshot the persisted values before the watcher below overwrites them —
// they describe what the user had already read on their previous visit.
const lastReadMessageTimestamp = dateOfLastReadMessage.value
const latestMessageIndexTimestamp = latestMessageIndex.value

watch(messages, (newMessages) => {
  latestMessageIndex.value = newMessages.at(0)?.sentAt || ''
  dateOfLastReadMessage.value = newMessages.at(-1)?.sentAt || ''
})

const lastMessageTimestamp = computed(() => messages.value.at(-1)?.sentAt || '')

watch(lastMessageTimestamp, (timestamp) => {
  if (!timestamp)
    return

  const unsubscribe = getLatestMessages(timestamp, (docs) => {
    messages.value = docs
  })

  onWatcherCleanup(unsubscribe)
})

function isUnread(sentAt: string) {
  if (!lastReadMessageTimestamp || !latestMessageIndexTimestamp)
    return false

  const messageIsUnread = dayjs(Number.parseInt(sentAt))
    .isAfter(dayjs(Number.parseInt(lastReadMessageTimestamp)))
  const latestMessagesHasBeenPreviouslyRead = latestMessageIndex.value === latestMessageIndexTimestamp

  return messageIsUnread && latestMessagesHasBeenPreviouslyRead
}

const latestOrder = computed(() => sortOrder.value.latest)
const sortedMessages = useParsedMessages(messages, latestOrder)

const displayedMessages = computed(() => sortedMessages.value.map(message => ({
  ...message,
  unread: isUnread(message.sentAt),
})))
</script>

<template>
  <section>
    <div v-if="isLoading">
      <LazySimpleListSkeleton :rows="10" />
    </div>

    <div v-else-if="error" class="p-8 text-center text-3xl md:text-5xl">
      <h1>Could not load the latest messages</h1>
      <p class="mt-4 text-lg text-slate-500 dark:text-slate-400">
        Please try again in a moment.
      </p>
    </div>

    <div v-else-if="hasMessages" class="flex flex-col">
      <MessageList :messages="displayedMessages" />
    </div>

    <div v-else class="p-8 text-center text-5xl md:text-8xl">
      <h1>No Messages Found</h1>
    </div>
  </section>
</template>
