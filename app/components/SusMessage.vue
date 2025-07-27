<script setup lang="ts">
const { dayjs } = useDayjs()

const { fetchEmotes, parseEmotes } = useEmotes()

await fetchEmotes()

const { data, status } = await useFetch<Message>('/api/messages/sus', {
  lazy: false,
})

const susMessageTimeFromNow = computed(() => {
  const sentAt = data.value?.sentAt

  if (!sentAt)
    return ''

  return dayjs.utc(Number.parseInt(sentAt)).fromNow()
})

const susMessageDate = computed(() => {
  const sentAt = data.value?.sentAt

  if (!sentAt)
    return ''

  return dayjs.utc(Number.parseInt(sentAt)).format('MMM D, YYYY')
})

const susRegExp = /^!(commands\s+edit|editcom)\s+(-cd=\d+\s+)?(!sus)\s(-cd=\d+\s)?(?<susMessage>.+)$/

const formattedSusMessage = computed(() => {
  const message = data.value?.message
  if (!message)
    return ''

  const match = message.match(susRegExp)

  return match?.groups?.susMessage?.trim() || ''
})

const parsedSusMessage = computed(() => parseEmotes(formattedSusMessage.value))
</script>

<template>
  <div class="text-center">
    <div class="bg-slate-300 px-4 py-2 dark:bg-slate-900">
      <h1 class="font-meduim text-xl">
        !SUS Message
      </h1>
      <h2 class="text-lg text-slate-600 dark:text-slate-300" :title="susMessageDate">
        Set by {{ data?.displayName }} {{ susMessageTimeFromNow }}
      </h2>
    </div>
    <div v-if="status === 'pending'">
      <SimpleListSkeleton :rows="1" />
    </div>

    <div v-else class="bg-slate-200 p-4 dark:bg-slate-800">
      <p v-html="parsedSusMessage" />
    </div>
  </div>
</template>
