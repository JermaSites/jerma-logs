<script setup lang="ts">
const route = useRoute()

const sortStore = useSortStore()
const { sortOrder } = storeToRefs(sortStore)

const { getMessages } = useMessages()

definePageMeta({
  validate(route) {
    return typeof route.params.month === 'string' && monthIndex(route.params.month) !== -1
  },
})

const year = computed(() => route.params.year as string)
const month = computed(() => route.params.month as string)

useSeoMeta({
  title: () => `${capitalize(month.value)} | ${year.value}`,
  description: () => `Every message Jerma985 sent in twitch chat during ${capitalize(month.value)} ${year.value}`,
})

// Reactive URL so navigating between months refetches, whether or not Vue
// reuses this component instance.
const { data: messages, status, error } = await useFetch<Message[]>(
  () => `/api/messages/${year.value}/${month.value}`,
  {
    server: false,
    lazy: true,
    default: () => [],
  },
)

const hasMessages = computed(() => messages.value.length > 0)
const isLoading = computed(() => status.value === 'idle' || status.value === 'pending')

const messageOrder = computed(() => sortOrder.value.message)
const sortedMessages = useParsedMessages(messages, messageOrder)

const bounds = computed(() => monthBounds(year.value, month.value))

// Firestore is only available client-side (its plugin is `.client.ts`), and
// only an in-progress month can still receive new messages.
if (import.meta.client) {
  watch(bounds, (range) => {
    if (!range || Number.parseInt(range.end) < Date.now())
      return

    const unsubscribe = getMessages(range.start, range.end, (docs) => {
      messages.value = docs
    })

    onWatcherCleanup(unsubscribe)
  }, { immediate: true })
}
</script>

<template>
  <section>
    <div v-if="isLoading">
      <SimpleListSkeleton :rows="15" />
    </div>

    <div v-else-if="error" class="p-8 text-center text-3xl md:text-5xl">
      <h1>Could not load these messages</h1>
      <p class="mt-4 text-lg text-slate-500 dark:text-slate-400">
        Please try again in a moment.
      </p>
    </div>

    <div v-else-if="hasMessages">
      <MessageList :messages="sortedMessages" />
    </div>

    <div v-else class="p-8 text-center text-5xl md:text-8xl">
      <h1>No Messages Found</h1>
    </div>
  </section>
</template>
