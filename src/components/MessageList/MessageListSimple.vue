<template>
  <div>
    <div v-for="msg in formattedMessages" :key="msg.id" class="columns">
      <div class="column is-narrow is-primary info">
        <div class="info-content">
          <div>
            <span class="has-text-grey-light">[{{ msg.sentAt }}]</span>
          </div>
          <div>
            <img v-for="badge in msg.badgeURLs" :key="badge" class="badge" :src="badge">
            <!-- <img class="badge" src="@/assets/badge-1.png">
            <img class="badge" src="@/assets/badge-2.png">
            <img class="badge" src="@/assets/badge-3.png"> -->
            <span class="username">{{ msg.displayName }}:</span>
          </div>
        </div>
      </div>
      <div class="column msg">
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
import { mapState } from 'vuex'
import emoteParser from '@/mixins/emoteParser'
export default {
  name: 'MessageListSimple',
  props: {
    messages: {
      type: Array,
      required: true
    }
  },
  mixins: [emoteParser],
  computed: {
    ...mapState(['allBadges']),
    formattedMessages () {
      const msgs = JSON.parse(JSON.stringify(this.messages))

      msgs.forEach(msg => {
        msg.sentAt = this.$moment.tz(+msg.sentAt, this.$moment.tz.guess()).format('YYYY-MM-DD hh:mm:ss A z')
        this.parseEmotes(msg)
        msg.badgeURLs = this.getBadgesForMessage(msg)

        msg.message = msg.message.split(/(?=<img .+>)/)
      })

      return msgs
    }
  },
  methods: {
    getBadgesForMessage (message) {
      const sortedKeys = Object.keys(message.badges).sort().reduce((prev, next) => {
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

.column {
  &.info {
    padding-right: 2px;
  }

  &.msg {
    padding-left: 2px;

    @media only screen and (max-width: $tablet) {
      padding-left: 12px;
    }
  }
}

.info-content {
  display: flex;
  flex-wrap: wrap;

  div:not(:last-child) {
    margin-right: 5px;
  }
}

.username {
  color: #00FF7F;
  font-weight: bold;
}

.badge {
  padding: 0 2px;
  vertical-align: text-bottom;
}
</style>
