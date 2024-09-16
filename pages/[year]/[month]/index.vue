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

const { data: messages, status } = await useFetch<Message[]>(
  `/api/messages/${year}/${month}`,
  {
    lazy: true,
    server: true,
  },
)

const isLoading = computed(() => {
  return status.value === 'pending'
})

const { fetchEmotes, parseEmotes } = useEmotes()
const { fetchBadges, parseBadges } = useBadges()

fetchEmotes()
fetchBadges()

// const dayjs = useDayjs()

// function isCurrentMonth() {
//   const currentDate = dayjs.utc()
//   const date = dayjs.utc(`${year}-${capitalize(month)}-01`, 'YYYY-MMMM-DD')
//   const endTime = date.endOf('month')

//   return endTime.isAfter(currentDate)
// }

// const { twitchUsername } = useRuntimeConfig().public
// const { db } = useFirebase()
// const unsub = ref<Unsubscribe>()

// onMounted(async () => {
//   const date = dayjs.utc(`${year}-${capitalize(month)}-01`, 'YYYY-MMMM-DD')
//   const startTime = date.startOf('month').valueOf().toString()
//   const endTime = date.endOf('month').valueOf().toString()

//   if (!isCurrentMonth())
//     return

//   const q = query(
//     collection(db, 'messages'),
//     where('sentAt', '>=', startTime),
//     where('sentAt', '<=', endTime),
//     where('username', '==', twitchUsername),
//   )

//   unsub.value = onSnapshot(q, (querySnapshot) => {
//     if (querySnapshot.docs.length === 0)
//       return
//     messages.value = querySnapshot.docs.map(doc => doc.data() as Message)
//   })
// })

// onUnmounted(() => {
//   if (!unsub.value)
//     return
//   unsub.value()
// })

const sortStore = useSortStore()
const { sortOrder } = storeToRefs(sortStore)

const sortedMessages = computed(() => {
  return messages?.value?.toSorted((a, b) => {
    if (sortOrder.value.message === 'asc')
      return Number.parseInt(a.sentAt) - Number.parseInt(b.sentAt)

    return Number.parseInt(b.sentAt) - Number.parseInt(a.sentAt)
  })
})
</script>

<template>
  <section>
    <div v-for="{ id, message } in messages" :key="id">
      {{ message }}
    </div>

    <div v-if="isLoading">
      <SimpleListSkeleton :rows="15" />
    </div>

    <Message
      v-for="msg in messages" :key="msg.id"
      :sent-at="msg.sentAt"
      :display-name="msg.displayName"
      :color="msg.color"
      :message="parseEmotes(msg.message)"
      :badges="parseBadges(msg.badges)"
    />

    <!-- <div v-else>
      <SimpleList>
        <SimpleListItem v-for="message in sortedMessages" :key="message.id">
          <Message
            :sent-at="message.sentAt"
            :display-name="message.displayName"
            :color="message.color"
            :message="parseEmotes(message.message)"
            :badges="parseBadges(message.badges)"
          />
        </SimpleListItem>
      </SimpleList>
    </div> -->

    <!-- <div v-else class="p-8 text-center text-5xl md:text-8xl">
      <h1>No Messages Found</h1>
    </div> -->
  </section>
</template>

<style scoped></style>
