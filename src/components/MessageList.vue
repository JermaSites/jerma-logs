<template>
  <div class="section">
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
    <div v-else v-for="msg in msgGroupedByDate" :key="msg.id" class="columns" :class="{ 'new-day': msg.newDay }">
      <div class="column is-narrow is-primary">
        <span class="has-text-grey-light">{{ formatDate(msg.sentAt) }}</span>
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
    }
  },
  data () {
    return {
      messages: [],
      loading: true,
      tz: this.$moment.tz.guess()
    }
  },
  computed: {
    msgGroupedByDate () {
      const msgs = [...this.messages]
      for (let i = 0; i < msgs.length - 2; i++) {
        const prev = msgs[i]
        const next = msgs[i + 1]
        const prevDay = this.$moment.tz(+prev.sentAt, this.tz).startOf('day').format()
        const nextDay = this.$moment.tz(+next.sentAt, this.tz).startOf('day').format()
        if (prevDay !== nextDay) {
          msgs[i].newDay = true
        }
      }

      return msgs
    }
  },
  methods: {
    formatDate (date) {
      return this.$moment.tz(+date, this.tz).format('YYYY-MM-DD hh:mm:ss A z')
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

.new-day {
  border-bottom: 3px solid $jerma-pink;
}
</style>
