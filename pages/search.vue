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
  firebaseMessages.value = []

  if (!hasResults.value)
    return

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

function clearSearch() {
  searchValue.value = ''
}

watch(page, (newPage) => {
  search({ query: searchValue.value, requestOptions: { page: newPage - 1 } })
})

const colorMode = useColorMode()
const algoliaLogo = computed(() => {
  const darkUrl = '/Algolia-mark-white.png'
  const lightUrl = '/Algolia-mark-blue.png'

  return colorMode.value === 'dark' ? darkUrl : lightUrl
})
</script>

<template>
  <section class="flex items-center my-4">
    <NuxtImg
      :src="algoliaLogo"
      class="mr-4 size-8"
      alt="Algolia logo"
    />

    <UInput
      v-model="searchValue"
      type="search"
      color="secondary"
      icon="heroicons-solid:magnifying-glass"
      size="xl"
      variant="outline"
      placeholder="Search..."
      class="w-full"
      :loading="loading"
      @keydown.enter="newSearch"
    >
      <template v-if="searchValue?.length" #trailing>
        <UButton
          color="neutral"
          variant="link"
          size="xl"
          icon="heroicons-solid:x-circle"
          aria-label="Clear input"
          @click="clearSearch"
        />
      </template>
    </UInput>
  </section>

  <section>
    <div v-if="loading">
      <LazySimpleListSkeleton :rows="20" />
    </div>

    <SimpleList v-else-if="hasResults">
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

    <div v-else-if="result && searchValue && result.query === searchValue" class="flex justify-center items-center p-4 text-6xl">
      <h1>No Messages Found</h1>
    </div>
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
