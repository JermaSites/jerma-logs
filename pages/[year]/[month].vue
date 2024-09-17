<script setup lang="ts">
import type { RouteLocationNormalizedLoaded } from '#vue-router'
import type { Breadcrumb, Message } from '@/types'
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  type Unsubscribe,
  where,
} from 'firebase/firestore'

const route = useRoute()
const { capitalize } = useCapitalize()

useSeoMeta({
  title: `Jerma Logs | ${route.params.year} | ${capitalize(route.params.month as string)}`,
  ogTitle: `Jerma Logs | ${capitalize(route.params.month as string)} ${
    route.params.year
  }`,
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
  breadcrumb(route: RouteLocationNormalizedLoaded): Breadcrumb[] {
    const { year, month } = route.params as { year: string, month: string }
    return [
      { label: 'Home', to: { name: 'index' } },
      { label: year, to: { name: 'year', params: { year } } },
      { label: month },
    ]
  },
})

const sortStore = useSortStore()
const { sortOrder } = storeToRefs(sortStore)

const { year, month } = route.params as { year: string, month: string }

const { data: messages, status } = await useFetch<Message[]>(`/api/messages/${year}/${month}`, {
  query: {
    order: sortOrder.value.message,
  },
  lazy: true,
})

const isLoading = computed(() => {
  return status.value === 'pending'
})

const hasMessages = computed(() => {
  return messages.value != null && messages.value.length !== 0
})

watch(() => sortOrder.value.message, (value) => {
  if (value === 'asc') {
    messages.value?.sort((a, b) => Number.parseInt(a.sentAt) - Number.parseInt(b.sentAt))
  }
  else {
    messages.value?.sort((a, b) => Number.parseInt(b.sentAt) - Number.parseInt(a.sentAt))
  }
})

const { fetchEmotes, parseEmotes } = useEmotes()
const { fetchBadges, parseBadges } = useBadges()

fetchEmotes()
fetchBadges()

const dayjs = useDayjs()
const { db } = useFirebase()
const { twitchUsername } = useRuntimeConfig().public
const unsub = ref<Unsubscribe>()

onMounted(async () => {
  const date = dayjs.utc(`${year}-${capitalize(month)}-01`, 'YYYY-MMMM-DD')
  const currentDate = dayjs.utc()
  const startTime = date.startOf('month')
  const endTime = date.endOf('month')

  if (endTime.isBefore(currentDate))
    return

  const q = query(
    collection(db, 'messages'),
    where('sentAt', '>=', startTime.valueOf().toString()),
    where('sentAt', '<=', endTime.valueOf().toString()),
    where('username', '==', twitchUsername),
    orderBy('sentAt', sortOrder.value.message),
  )

  unsub.value = onSnapshot(q, (querySnapshot) => {
    if (querySnapshot.docs.length === 0)
      return
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
    <div v-if="isLoading">
      <SimpleListSkeleton :rows="15" />
    </div>

    <div v-else-if="hasMessages">
      <SimpleList>
        <SimpleListItem v-for="message in messages" :key="message.id">
          <Message
            :sent-at="message.sentAt"
            :display-name="message.displayName"
            :color="message.color"
            :message="parseEmotes(message.message)"
            :badges="parseBadges(message.badges)"
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
