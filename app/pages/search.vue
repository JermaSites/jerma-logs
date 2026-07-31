<script setup lang="ts">
const settingsStore = useSettingsStore()
const { colorModeValue } = storeToRefs(settingsStore)

const { searchMessages } = useMessages()

const { y } = useWindowScroll({ behavior: 'smooth' })

const { result, search } = useAlgoliaSearch<AlgoliaIndex>('messages')

useSeoMeta({
  title: 'Search',
  description: 'Search every message Jerma985 has sent in twitch chat',
})

const hasResults = computed(() => Boolean(result.value?.hits?.length))

const messages = ref<Message[]>([])
const loading = ref(false)

const parsedMessages = useParsedMessages(messages)

// Searches resolve out of order when the user types quickly; only the newest
// request is allowed to write its results.
let latestRequestId = 0

watch(result, async (result) => {
  const requestId = ++latestRequestId
  messages.value = []

  if (!hasResults.value)
    return

  loading.value = true

  try {
    const found = await searchMessages(result)

    if (requestId !== latestRequestId)
      return

    messages.value = found
    y.value = 0
  }
  catch (error) {
    console.error(error)
  }
  finally {
    if (requestId === latestRequestId)
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

const algoliaLogo = computed(() => {
  return colorModeValue.value === 'dark'
    ? '/Algolia-mark-white.png'
    : '/Algolia-mark-blue.png'
})
</script>

<template>
  <section class="flex items-center my-4">
    <NuxtImg
      :src="algoliaLogo"
      class="mr-4 size-8"
      width="32"
      height="32"
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

    <MessageList v-else-if="hasResults" :messages="parsedMessages" />

    <div v-else-if="result && searchValue && result.query === searchValue" class="flex justify-center items-center p-4 text-6xl">
      <h1>No Messages Found</h1>
    </div>
  </section>

  <section v-if="hasResults" class="flex justify-center items-center p-4">
    <UPagination
      v-model:page="page"
      size="xl"
      active-color="secondary"
      first-icon="heroicons-solid:chevron-double-left"
      prev-icon="heroicons-solid:chevron-left"
      next-icon="heroicons-solid:chevron-right"
      last-icon="heroicons-solid:chevron-double-right"
      :total="result.nbHits"
      :items-per-page="result.hitsPerPage"
    />
  </section>
</template>
