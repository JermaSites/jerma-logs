<template>
  <div>
    <div v-for="msg in formattedMessages" :key="msg.id" class="columns" :class="{ 'new-day': msg.newDay }">
      <div class="column is-narrow is-primary">
        <span class="has-text-grey-light">{{ msg.sentAt }}</span>
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
  name: 'SeperatedDayChrono',
  props: {
    messages: {
      type: Array,
      required: true
    }
  },
  computed: {
    formattedMessages () {
      const msgs = JSON.parse(JSON.stringify(this.messages))
      const tz = this.$moment.tz.guess()
      const msgsByDay = []

      msgs.forEach(msg => {
        msg.sentAt = this.$moment.tz(+msg.sentAt, this.$moment.tz.guess()).format('YYYY-MM-DD hh:mm:ss A z')
      })

      let slicePoint = 0
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

        if (prevDay !== nextDay) {
          msgsByDay.push(msgs.slice(slicePoint, i + 1))
          slicePoint = i + 1
        }
      }

      msgsByDay.push(msgs.slice(slicePoint))

      return msgsByDay.map(day => {
        day.reverse()
        day.forEach(d => {
          d.newDay = false
        })
        day[0].newDay = true
        return day
      }).flat()
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

.columns:last-child {
  border-bottom: 3px solid $jerma-pink;
}
</style>
