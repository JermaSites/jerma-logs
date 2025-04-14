<script setup lang="ts">
import type { AlgoliaIndex, Message } from '~/types'
import { collection, getDocs, query, where } from 'firebase/firestore'

const { y } = useWindowScroll({ behavior: 'smooth' })

const { fetchEmotes, parseEmotes } = useEmotes()
const { fetchBadges, parseBadges } = useBadges()

fetchEmotes()
fetchBadges()

const { result, search } = useAlgoliaSearch<AlgoliaIndex>('messages')

const hasResults = computed(() => {
  return result.value && result.value.hits && result.value.hits.length > 0
})

const { db } = useFirebase()
const firebaseMessages = ref<Message[]>()
const { twitchUsername } = useRuntimeConfig().public
const loading = ref(false)

watch(result, async () => {
  if (!hasResults.value)
    return

  firebaseMessages.value = []
  const q = query(
    collection(db, 'messages'),
    where('username', '==', twitchUsername),
    where('__name__', 'in', result.value.hits.map(hit => hit.objectID)),
  )

  try {
    loading.value = true
    const querySnapshot = await getDocs(q)
    firebaseMessages.value = querySnapshot.docs.map(doc => doc.data() as Message)
    y.value = 0
  }
  catch (error) {
    console.error(error)
  }
  finally {
    loading.value = false
  }
})

const page = ref(1)
const searchValue = ref('')

function newSearch() {
  page.value = 1
  search({ query: searchValue.value })
}

watch(page, (newPage) => {
  search({ query: searchValue.value, requestOptions: { page: newPage - 1 } })
})
</script>

<template>
  <section class="my-4">
    <UInput
      v-model="searchValue"
      color="secondary"
      icon="heroicons-solid:magnifying-glass"
      size="xl"
      variant="outline"
      placeholder="Search..."
      class="w-full"
      @keydown.enter="newSearch"
    >
      <template v-if="searchValue?.length" #trailing>
        <UButton
          color="neutral"
          variant="link"
          size="xl"
          icon="heroicons-solid:x-circle"
          aria-label="Clear input"
          @click="searchValue = ''"
        />
      </template>
    </UInput>
  </section>

  <section>
    <div v-if="loading">
      <LazySimpleListSkeleton :rows="20" />
    </div>

    <SimpleList v-else>
      <SimpleListItem v-for="message in firebaseMessages" :key="message.id">
        <Message
          v-if="!message.reply"
          :sent-at="message.sentAt"
          :display-name="message.displayName"
          :color="message.color"
          :message="parseEmotes(message.message)"
          :badges="parseBadges(message.badges)"
        />

        <Message
          v-else
          :sent-at="message.sentAt"
          :display-name="message.displayName"
          :color="message.color"
          :message="parseEmotes(message.message)"
          :badges="parseBadges(message.badges)"
          :reply-message="parseEmotes(message.reply.parent.msgBody)"
        />
      </SimpleListItem>
    </SimpleList>
  </section>

  <section v-if="hasResults" class="flex justify-center items-center p-4">
    <UPagination
      v-model:page="page"
      size="xl"
      active-color="secondary"
      :total="result.nbHits"
      :items-per-page="result.hitsPerPage"
    />
  </section>
</template>

<style scoped>

</style>
