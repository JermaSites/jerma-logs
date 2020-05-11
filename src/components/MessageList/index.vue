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
      <component :is="layout" :messages="sortedMessages" />
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
    sortedMessages () {
      return this.sort === 'desc' ? this.messages : JSON.parse(JSON.stringify(this.messages)).reverse()
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
