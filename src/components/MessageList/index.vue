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
    <div v-else-if="!messages">
      <h1 class="title is-1 has-text-white">No Messages Yet!</h1>
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
      if (!this.messages) return []
      let msgs = JSON.parse(JSON.stringify(this.messages.messages))
      msgs = msgs
        .filter(msg => msg.username === process.env.VUE_APP_USERNAME)
        .sort((a, b) => +b.sentAt - +a.sentAt)
      return this.sort === 'desc' ? msgs : msgs.reverse()
    }
  },
  async created () {
    try {
      this.loading = true

      const query = db.collection('messagesByMonth').doc(`${this.month}-${this.year}`)

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
