<template>
  <div>
    <div v-for="msg in formattedMessages" :key="msg.id" title="Copy" class="columns message" :class="{ 'new-day': msg.newDay }" @click="copyMessageToClipboard(msg)">
      <div class="column is-narrow is-primary info">
        <div class="info-content">
          <div>
            <span class="has-text-grey-light">[{{ msg.sentAt }}]</span>
          </div>
          <div>
            <img v-for="badge in msg.badgeURLs" :key="badge" class="badge" :src="badge">
            <span class="username" :style="{ color: msg.color }">{{ msg.displayName }}:</span>
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
  },
  methods: {
    copyMessageToClipboard (msg) {
      console.log(msg.message)
      let message = ''
      msg.message.forEach(msgFragment => {
        if (this.isEmote(msgFragment)) {
          message += msgFragment.match(/alt="(.+)"/)[1]
        } else {
          message += msgFragment
        }
      })
      const formattedMessage = `[${msg.sentAt}] ${msg.displayName}: ${message}`
      navigator.clipboard.writeText(formattedMessage)
      console.log('copied message', formattedMessage)
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

.message {
  cursor: pointer;

  // &:hover::after {
  //   content:url('../../assets/content-copy.svg');
  //   font-family: "Roboto";
  //   display:flex;
  //   color: black;
  //   flex-direction:row;
  //   align-items: center;
  //   justify-content: center;
  //   position: relative;
  //   background: $jerma-green;
  //   vertical-align: middle;
  //   padding-top: 5px;
  //   right: 0px;
  //   width: 50px;
  // }
}
</style>
