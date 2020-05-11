<template>
  <div>
    <div v-for="msg in formattedMessages" :key="msg.id" class="columns">
      <div class="column is-narrow is-primary">
        <span class="has-text-grey-light">[{{ msg.sentAt }}] {{ msg.displayName }}</span>
      </div>
      <div class="column">
        <span
          class="has-text-light"
          v-linkified:options="{
            attributes: { rel: 'noopener noreferrer nofollow' }
          }"
          v-html="parseEmotes(msg)"
        >
          <!-- {{ parseEmotes(msg) }} -->
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MessageListSimple',
  props: {
    messages: {
      type: Array,
      required: true
    }
  },
  computed: {
    formattedMessages () {
      const msgs = JSON.parse(JSON.stringify(this.messages))

      msgs.forEach(msg => {
        msg.sentAt = this.$moment.tz(+msg.sentAt, this.$moment.tz.guess()).format('YYYY-MM-DD hh:mm:ss A z')
      })

      return msgs
    }
  },
  methods: {
    parseEmotes (msg) {
      const message = msg.message
      const url = 'https://static-cdn.jtvnw.net/emoticons/v1'
      const emotes = msg.emotesRaw ? msg.emotesRaw.split('/') : []
      for (let i = 0; i < emotes.length; i++) {
        const emote = emotes[i]
        const emoteID = emote.split(':')[0]
        const emoteLocations = emote.split(':')[1]
        const firstLocation = emoteLocations.split(',')[0]
        const firstLocationStart = +firstLocation.split('-')[0]
        const firstLocationEnd = +firstLocation.split('-')[1] + 1

        const emoteURL = `${url}/${emoteID}/1.0`
        const img = `<img src="${emoteURL}" style="vertical-align: text-bottom">`

        const emoteName = message.substring(firstLocationStart, firstLocationEnd)
        msg.message = msg.message.split(emoteName).join(img)
      }
      return msg.message
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
