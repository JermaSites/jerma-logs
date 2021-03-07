import { randomBytes } from 'crypto'
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState(['globalEmotes', 'channelEmotes']),
    secret () {
      return randomBytes(48).toString('hex')
    }
  },
  methods: {
    isEmote (text) {
      const isImg = text.startsWith('<img')
      if (isImg) {
        const parser = new DOMParser()
        const doc = parser.parseFromString(text, 'text/html')
        const imgSecret = doc.body.firstChild.dataset.secret
        return this.secret === imgSecret
      }

      return false
    },
    parseEmotes (msg) {
      return this.parseBTTVEmotes(this.parseTwitchEmotes(msg))
    },
    parseTwitchEmotes (msg) {
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
        const img = `<img src="${emoteURL}" style="vertical-align: middle" data-secret="${this.secret}">`

        const emoteName = message.substring(firstLocationStart, firstLocationEnd)
        msg.message = msg.message.split(emoteName).join(img)
      }
      return msg
    },
    parseBTTVEmotes (msg) {
      const urlTemplate = '//cdn.betterttv.net/emote/{{id}}/1x'
      const emotes = [...this.globalEmotes, ...this.channelEmotes]
      emotes.forEach(emote => {
        const emoteURL = urlTemplate.replace('{{id}}', emote.id)
        const img = `<img src="${emoteURL}" style="vertical-align: middle" data-secret="${this.secret}">`
        const regex = new RegExp(emote.code)
        msg.message = msg.message.split(regex).join(img)
      })
      return msg
    }
  }
}
