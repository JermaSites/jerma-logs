<script setup lang="ts">
const sortStore = useSortStore()
const { sortOrder } = storeToRefs(sortStore)

const unreadStore = useUnreadStore()
const { unreadMessages } = storeToRefs(unreadStore)

useSeoMeta({
  description: 'Browse every message Jerma985 has sent in twitch chat, from May 2020 onwards',
})
</script>

<template>
  <section class="mb-6">
    <YearList :sort-order="sortOrder.year" />
  </section>

  <section class="mb-6">
    <SimpleList>
      <SimpleListItem>
        <NuxtLink :to="{ name: 'latest' }" class="block p-4 font-medium">
          <div class="flex items-center gap-4">
            Latest Messages

            <UBadge v-if="unreadMessages" color="info" icon="heroicons-solid:mail">
              New Messages
            </UBadge>
          </div>
        </NuxtLink>
      </SimpleListItem>
    </SimpleList>
  </section>

  <section>
    <SusMessage />
  </section>
</template>
