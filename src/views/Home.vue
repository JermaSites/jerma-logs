<template>
  <div>
    <div class="container is-fluid">
      <div class="columns is-centered">
        <div class="column is-three-fifths-fullhd is-three-quarters-desktop is-full">
          <b-loading :is-full-page="false" :active.sync="loading" :can-cancel="true"></b-loading>
          <div v-for="msg in messages" :key="msg.id" class="columns is-variable is-1 is-mobile">
            <div class="column is-narrow">
              <span class="date">{{ formatDate(msg.sentAt) }}: </span>
            </div>
            <div class="column">
              <span class="msg" v-linkified>{{ msg.message }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { db } from '@/db'

export default {
  name: 'Home',
  data () {
    return {
      messages: [],
      loading: false
    }
  },
  methods: {
    formatDate (date) {
      return this.$moment(+date).format('YYYY-MM-DD hh:mm:ss A')
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

<style scoped>
.columns:nth-child(even) {
  background-color: #3a3f44;
}

/* .column {
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
} */

.msg {
  color: white;
}
</style>
