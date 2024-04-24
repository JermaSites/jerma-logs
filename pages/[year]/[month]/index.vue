<script setup lang="ts">
import { capitalize } from 'vue'
import {
  type Unsubscribe,
  collection,
  onSnapshot,
  query,
  where,
} from 'firebase/firestore'
import type { Breadcrumb, Message } from '@/types'
import type { RouteLocationNormalizedLoaded } from '#vue-router'

const dayjs = useDayjs()

const route = useRoute()

useServerSeoMeta({
  title: `Jerma Logs | ${capitalize(route.params.month as string)} ${
    route.params.year
  }`,
  ogTitle: `Jerma Logs | ${capitalize(route.params.month as string)} ${
    route.params.year
  }`,
})

useSeoMeta({
  title: `Jerma Logs | ${capitalize(route.params.month as string)} ${
    route.params.year
  }`,
  ogTitle: `Jerma Logs | ${capitalize(route.params.month as string)} ${
    route.params.year
  }`,
})

definePageMeta({
  breadcrumb(route: RouteLocationNormalizedLoaded): Breadcrumb[] {
    const { year, month } = route.params as { year: string, month: string }
    return [
      { label: 'Home', to: { name: 'index' } },
      { label: year, to: { name: 'year', params: { year } } },
      { label: month },
    ]
  },
})

const { fetchEmotes, parseEmotes } = useEmotes()
const { fetchBadges, parseBadges } = useBadges()

fetchEmotes()
fetchBadges()

const { year, month } = route.params as { year: string, month: string }

const isCurrentMonth = computed(() => {
  const currentDate = dayjs.utc()
  const date = dayjs.utc(`${year}-${capitalize(month)}-01`, 'YYYY-MMMM-DD')
  const endTime = date.endOf('month')

  return endTime.isAfter(currentDate)
})

const { data: messages, pending } = await useFetch<Message[]>(
  `/api/messages/${year}/${month}`,
  {
    lazy: true,
  },
)

const { twitchUsername } = useRuntimeConfig().public
const { db } = useFirebase()
const unsub = ref<Unsubscribe>()

onMounted(async () => {
  const date = dayjs.utc(`${year}-${capitalize(month)}-01`, 'YYYY-MMMM-DD')
  const startTime = date.startOf('month').valueOf().toString()
  const endTime = date.endOf('month').valueOf().toString()

  if (!isCurrentMonth.value)
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
    <div v-if="sortedMessages && sortedMessages.length !== 0">
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
    </div>

    <div v-else-if="pending">
      <SimpleList>
        <SimpleListItem v-for="i in 10" :key="i" class="h-14 p-5">
          <div class="flex gap-1">
            <USkeleton class="h-4 w-[200px]" :ui="{ background: 'bg-slate-400 dark:bg-slate-600' }" />
            <USkeleton class="h-4 w-[150px]" :ui="{ background: 'bg-slate-400 dark:bg-slate-600' }" />
            <USkeleton class="h-4 w-full" :ui="{ background: 'bg-slate-400 dark:bg-slate-600' }" />
          </div>
        </SimpleListItem>
      </SimpleList>
    </div>

    <div v-else-if="sortedMessages && sortedMessages.length === 0" class="p-8 text-center text-5xl md:text-8xl">
      <h1>No Messages Found</h1>
    </div>
  </section>
</template>

<style scoped></style>
