<script setup lang="ts">
const settingsStore = useSettingsStore()
const { colorModeValue } = storeToRefs(settingsStore)

const { searchMessages } = useMessages()

const { y } = useWindowScroll({ behavior: 'smooth' })

const { result, search } = useAlgoliaSearch<AlgoliaIndex>('messages')

const { parseEmotes } = useEmotes()
const { parseBadges } = useBadges()

const hasResults = computed(() => {
  return result.value && result.value.hits && result.value.hits.length > 0
})

const messages = ref<Message[]>([])
const loading = ref(false)

watch(result, async (result) => {
  messages.value = []

  if (!hasResults.value)
    return

  try {
    loading.value = true
    messages.value = await searchMessages(result)
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

const algoliaLogo = computed(() => {
  const darkUrl = '/Algolia-mark-white.png'
  const lightUrl = '/Algolia-mark-blue.png'

  return colorModeValue.value === 'dark' ? darkUrl : lightUrl
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
      <SimpleListItem v-for="message in messages" :key="message.id">
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
