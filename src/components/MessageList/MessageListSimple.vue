<template>
  <div>
    <div v-for="msg in formattedMessages" :key="msg.id" class="columns">
      <div class="column is-narrow is-primary">
        <span class="has-text-grey-light">[{{ msg.sentAt }}] {{ msg.displayName }}</span>
      </div>
      <div class="column">
        <span
          class="has-text-light"
          v-linkified:options="{
            attributes: { rel: 'noopener noreferrer nofollow' }
          }"
        >
          {{ msg.message }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MessageListSimple',
  props: {
    messages: {
      type: Array,
      required: true
    }
  },
  computed: {
    formattedMessages () {
      const msgs = JSON.parse(JSON.stringify(this.messages))

      msgs.forEach(msg => {
        msg.sentAt = this.$moment.tz(+msg.sentAt, this.$moment.tz.guess()).format('YYYY-MM-DD hh:mm:ss A z')
      })

      return msgs
    }
  }
}
</script>

<style lang="scss" scoped>
.columns:nth-child(even) {
  background-color: $accent;
}
.columns:nth-child(odd) {
  background-color: $primary;
}
</style>
