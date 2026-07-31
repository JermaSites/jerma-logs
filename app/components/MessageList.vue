<script setup lang="ts">
defineProps<{
  messages: ParsedMessage[]
}>()
</script>

<template>
  <SimpleList>
    <SimpleListItem v-for="message in messages" :key="message.id">
      <Message
        :sent-at="message.sentAt"
        sent-at-format="MMM DD hh:mm A z"
        :display-name="message.displayName"
        :color="message.color"
        :message="message.message"
        :badges="message.badges"
        :reply-message="message.reply"
        :unread="message.unread"
      />
    </SimpleListItem>
  </SimpleList>
</template>
