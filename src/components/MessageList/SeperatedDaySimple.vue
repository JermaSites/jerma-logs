<template>
  <div>
    <div v-for="msg in formattedMessages" :key="msg.id" class="columns" :class="{ 'new-day': msg.newDay }">
      <div class="column is-narrow is-primary">
        <span class="has-text-grey-light">[{{ msg.sentAt }}] {{ msg.displayName }}</span>
      </div>
      <div class="column">
        <span
          class="has-text-light"
          v-linkified:options="{
            attributes: { rel: 'noopener noreferrer nofollow' }
          }"
          v-for="(text, i) in msg.message" :key="i"
        >
          <span v-if="isEmote(text)" v-html="text"></span>
          <span v-else>{{ text }}</span>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import emoteParser from '@/mixins/emoteParser'
export default {
  name: 'SeperatedDaySimple',
  props: {
    messages: {
      type: Array,
      required: true
    }
  },
  mixins: [emoteParser],
  computed: {
    formattedMessages () {
      const msgs = JSON.parse(JSON.stringify(this.messages))
      const tz = this.$moment.tz.guess()

      msgs.forEach(msg => {
        msg.sentAt = this.$moment.tz(+msg.sentAt, this.$moment.tz.guess()).format('YYYY-MM-DD hh:mm:ss A z')
        this.parseEmotes(msg)

        msg.message = msg.message.split(/(<img .+>)/)
      })

      for (let i = 0; i < msgs.length - 1; i++) {
        const prev = msgs[i]
        const next = msgs[i + 1]

        const prevDay = this.$moment(prev.sentAt, 'YYYY-MM-DD hh:mm:ss A z')
          .tz(tz)
          .startOf('day')
          .format()

        const nextDay = this.$moment(next.sentAt, 'YYYY-MM-DD hh:mm:ss A z')
          .tz(tz)
          .startOf('day')
          .format()

        next.newDay = false
        if (prevDay !== nextDay) {
          next.newDay = true
        }
      }

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

.new-day {
  border-top: 3px solid $jerma-pink;
}

.columns:first-child {
  border-top: 3px solid $jerma-pink;
}
.columns:last-child {
  border-bottom: 3px solid $jerma-pink;
}
</style>
