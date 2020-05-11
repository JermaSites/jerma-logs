<template>
  <div >
    <div v-if="loading">
      <div v-for="i in 6" :key="i" class="columns">
        <div class="column is-narrow is-primary">
          <b-skeleton width="200" />
        </div>
        <div class="column">
          <b-skeleton />
        </div>
      </div>
    </div>
    <div v-else>
      <component :is="layout" :messages="formattedMessages" />
    </div>
  </div>
</template>

<script>
import { db } from '@/db'

export default {
  name: 'MessageList',
  props: {
    year: {
      type: String,
      required: true
    },
    month: {
      type: String,
      required: true
    },
    layout: {
      type: String,
      default: 'MessageListSimple'
    },
    sort: {
      type: String,
      default: 'desc'
    }
  },
  components: {
    MessageListSimple: () => import('@/components/MessageList/MessageListSimple'),
    SeperatedDaySimple: () => import('@/components/MessageList/SeperatedDaySimple'),
    SeperatedDayChrono: () => import('@/components/MessageList/SeperatedDayChrono')
  },
  data () {
    return {
      messages: [],
      loading: true,
      tz: this.$moment.tz.guess()
    }
  },
  computed: {
    formattedMessages () {
      switch (this.layout) {
        case 'MessageListSimple':
          return this.sortedMessages
        case 'SeperatedDaySimple':
          return this.msgsByDay
        case 'SeperatedDayChrono':
          return this.msgsByDayChrono
        default:
          return this.sortedMessages
      }
    },
    msgsByDay () {
      const msgs = JSON.parse(JSON.stringify(this.sortedMessages))
      for (let i = 0; i < msgs.length - 1; i++) {
        const prev = msgs[i]
        const next = msgs[i + 1]

        const prevDay = this.$moment(prev.sentAt, 'YYYY-MM-DD hh:mm:ss A z')
          .tz(this.tz)
          .startOf('day')
          .format()

        const nextDay = this.$moment(next.sentAt, 'YYYY-MM-DD hh:mm:ss A z')
          .tz(this.tz)
          .startOf('day')
          .format()

        next.newDay = false
        if (prevDay !== nextDay) {
          next.newDay = true
        }
      }

      return msgs
    },
    msgsByDayChrono () {
      const msgs = JSON.parse(JSON.stringify(this.sortedMessages))
      const msgsByDay = []
      let slicePoint = 0
      for (let i = 0; i < msgs.length - 1; i++) {
        const prev = msgs[i]
        const next = msgs[i + 1]

        const prevDay = this.$moment(prev.sentAt, 'YYYY-MM-DD hh:mm:ss A z')
          .tz(this.tz)
          .startOf('day')
          .format()

        const nextDay = this.$moment(next.sentAt, 'YYYY-MM-DD hh:mm:ss A z')
          .tz(this.tz)
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
        day.map(d => {
          d.newDay = false
          return d
        })
        day[0].newDay = true
        return day
      }).flat()
    },
    dateFormattedMessages () {
      const messagesClone = JSON.parse(JSON.stringify(this.messages))
      return messagesClone.map(msg => {
        msg.sentAt = this.$moment.tz(+msg.sentAt, this.tz).format('YYYY-MM-DD hh:mm:ss A z')
        return msg
      })
    },
    sortedMessages () {
      return this.sort === 'desc' ? this.dateFormattedMessages : JSON.parse(JSON.stringify(this.dateFormattedMessages)).reverse()
    }
  },
  async created () {
    try {
      this.loading = true

      const startDate = this.$moment(`${this.year}-${this.month}`, 'YYYY-MMMM')
        .tz(this.tz)
        .startOf('month')
        .valueOf()
        .toString()

      const endDate = this.$moment(`${this.year}-${this.month}`, 'YYYY-MMMM')
        .tz(this.tz)
        .endOf('month')
        .valueOf()
        .toString()

      const query = db.collection('messages')
        .where('username', '==', process.env.VUE_APP_USERNAME)
        .where('sentAt', '>=', startDate)
        .where('sentAt', '<=', endDate)
        .orderBy('sentAt', 'desc')

      await this.$bind('messages', query)
    } catch (error) {
      console.error(error)
    } finally {
      this.loading = false
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
