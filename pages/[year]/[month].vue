<script setup lang="ts">
import type { RouteLocationNormalizedLoaded } from '#vue-router'
import type { Breadcrumb, Message } from '@/types'
import {
  collection,
  onSnapshot,
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

const { year, month } = route.params as { year: string, month: string }

const { data: messages, status } = await useFetch<Message[]>(`/api/messages/${year}/${month}`, {
  lazy: true,
})

const isLoading = computed(() => {
  return status.value === 'pending'
})

const hasMessages = computed(() => {
  return messages.value != null && messages.value.length !== 0
})

const sortStore = useSortStore()
const { sortOrder } = storeToRefs(sortStore)

watchEffect(() => {
  if (sortOrder.value.message === 'asc') {
    messages.value?.sort((a, b) => Number.parseInt(a.sentAt) - Number.parseInt(b.sentAt))
  }
  else {
    messages.value?.sort((a, b) => Number.parseInt(b.sentAt) - Number.parseInt(a.sentAt))
  }
})

// const sortedMessages = computed(() => {
//   if (sortOrder.value.message === 'asc') {
//     messages.value?.sort((a, b) => Number.parseInt(a.sentAt) - Number.parseInt(b.sentAt))
//   }
//   else {
//     messages.value?.sort((a, b) => Number.parseInt(b.sentAt) - Number.parseInt(a.sentAt))
//   }
// })

const { fetchEmotes, parseEmotes } = useEmotes()
const { fetchBadges, parseBadges } = useBadges()

fetchEmotes()
fetchBadges()

const dayjs = useDayjs()

function isCurrentMonth() {
  const currentDate = dayjs.utc()
  const date = dayjs.utc(`${year}-${capitalize(month)}-01`, 'YYYY-MMMM-DD')
  const endTime = date.endOf('month')

  return endTime.isAfter(currentDate)
}

const { twitchUsername } = useRuntimeConfig().public
const { db } = useFirebase()
const unsub = ref<Unsubscribe>()

onMounted(async () => {
  const date = dayjs.utc(`${year}-${capitalize(month)}-01`, 'YYYY-MMMM-DD')
  const startTime = date.startOf('month').valueOf().toString()
  const endTime = date.endOf('month').valueOf().toString()

  if (!isCurrentMonth())
    return

  const q = query(
    collection(db, 'messages'),
    where('sentAt', '>=', startTime),
    where('sentAt', '<=', endTime),
    where('username', '==', twitchUsername),
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
