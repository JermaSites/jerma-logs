<script setup lang="ts">
const route = useRoute()
const { dayjs } = useDayjs()

const sortStore = useSortStore()
const { sortOrder } = storeToRefs(sortStore)

const { messages, getMessages } = useMessages()

const { fetchEmotes, parseEmotes } = useEmotes()
const { fetchBadges, parseBadges } = useBadges()

useSeoMeta({
  title: `${capitalize(route.params.month as string)} | ${route.params.year}`,
})

definePageMeta({
  validate(route) {
    if (typeof route.params.month !== 'string')
      return false

    const month = route.params.month.toLowerCase()
    const months = [
      'january',
      'february',
      'march',
      'april',
      'may',
      'june',
      'july',
      'august',
      'september',
      'october',
      'november',
      'december',
    ]
    return months.includes(month)
  },
})

fetchEmotes()
fetchBadges()

const { year, month } = route.params as { year: string, month: string }

const { data, status } = await useFetch<Message[]>(`/api/messages/${year}/${month}`, {
  query: {
    order: sortOrder.value.message,
  },
  server: false,
  lazy: true,
  default() {
    return []
  },
})

const hasMessages = computed(() => messages.value.length > 0)
const isLoading = computed(() => status.value === 'idle' || status.value === 'pending')

watch(data, (msg) => {
  messages.value = msg
})

const sortedMessages = computed(() => {
  return messages.value.toSorted((a, b) => {
    const aTime = Number.parseInt(a.sentAt)
    const bTime = Number.parseInt(b.sentAt)

    return sortOrder.value.message === 'asc'
      ? aTime - bTime
      : bTime - aTime
  })
})

onMounted(async () => {
  const date = dayjs.utc(`${year}-${capitalize(month)}-01`, 'YYYY-MMMM-DD')
  const currentDate = dayjs.utc()
  const startTime = date.startOf('month')
  const endTime = date.endOf('month')

  if (endTime.isBefore(currentDate))
    return

  const start = startTime.valueOf().toString()
  const end = endTime.valueOf().toString()
  const order = sortOrder.value.message

  const unsubscribe = getMessages(start, end, order)

  onUnmounted(() => {
    unsubscribe()
  })
})
</script>

<template>
  <section>
    <div v-if="isLoading">
      <SimpleListSkeleton :rows="15" />
    </div>

    <div v-else-if="hasMessages">
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
          />
        </SimpleListItem>
      </SimpleList>
    </div>

    <div v-else class="p-8 text-center text-5xl md:text-8xl">
      <h1>No Messages Found</h1>
    </div>
  </section>
</template>
