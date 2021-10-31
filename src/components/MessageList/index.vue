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
    <div v-else-if="sortedMessages.length <= 0">
      <h1 class="title is-1 has-text-white">No Messages Yet!</h1>
    </div>
    <div v-else>
      <component :is="layout" :messages="sortedMessages" />
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { db } from '@/db'
const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

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
    ...mapState(['allBadges']),
    sortedMessages () {
      if (!this.messages) return []
      let msgs = JSON.parse(JSON.stringify(this.messages.messages))
      msgs = msgs
        .filter(msg => msg.username === process.env.VUE_APP_USERNAME)
        .sort((a, b) => +b.sentAt - +a.sentAt)
        .map(msg => {
          msg.badgeURLs = this.getBadgesForMessage(msg)
          return msg
        })
      return this.sort === 'desc' ? msgs : msgs.reverse()
    }
  },
  async created () {
    try {
      this.loading = true
      await this.fetchEmotes()
      await this.fetchBadges()
      await this.$bind('messages', db.collection('messagesByYear').doc(this.year).collection('messagesByMonth').doc(this.month))
      await sleep(300)
      this.loading = false
    } catch (error) {
      console.error(error)
    }
  },
  methods: {
    ...mapActions(['fetchEmotes', 'fetchBadges']),
    getBadgesForMessage (message) {
      if (!message.badges) return []
      const sortedKeys = Object.keys(message.badges)
        .sort((a, b) => {
          let aValue
          let bValue
          switch (a) {
            case 'broadcaster':
              aValue = 0
              break
            case 'subscriber':
              aValue = 1
              break
            default:
              aValue = 2
              break
          }
          switch (b) {
            case 'broadcaster':
              bValue = 0
              break
            case 'subscriber':
              bValue = 1
              break
            default:
              bValue = 2
              break
          }
          return aValue - bValue
        })
        .reduce((prev, next) => {
          prev[next] = message.badges[next]
          return prev
        }, {})

      const badges = Object.entries(sortedKeys)

      return badges.map(badge => {
        const badgeURL = this.allBadges.badge_sets[badge[0]].versions[badge[1]].image_url_1x
        return badgeURL
      })
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
