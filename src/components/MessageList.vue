<template>
  <div class="section">
    <b-loading :is-full-page="true" :active.sync="loading"></b-loading>
    <div v-for="msg in messages" :key="msg.id" class="columns">
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
  data () {
    return {
      messages: [],
      loading: true,
      tz: this.$moment.tz.guess()
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
      const query = db.collection('messages')
        .where('username', '==', process.env.VUE_APP_USERNAME)
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
