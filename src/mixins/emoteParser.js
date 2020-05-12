import bttvChannel from '@/assets/BTTV-channel-emotes.json'
import bttvGlobal from '@/assets/BTTV-global-emotes.json'
import { randomBytes } from 'crypto'

export default {
  computed: {
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
        const img = `<img src="${emoteURL}" style="vertical-align: text-bottom" data-secret="${this.secret}">`

        const emoteName = message.substring(firstLocationStart, firstLocationEnd)
        msg.message = msg.message.split(emoteName).join(img)
      }
      return msg
    },
    parseBTTVEmotes (msg) {
      const { urlTemplate } = bttvGlobal
      const globalEmotes = bttvGlobal.emotes
      const channelEmotes = bttvChannel.emotes
      const emotes = [...globalEmotes, ...channelEmotes]
      emotes.forEach(emote => {
        const emoteURL = urlTemplate.replace('{{id}}', emote.id).replace('{{image}}', '1x')
        const img = `<img src="${emoteURL}" style="vertical-align: text-bottom" data-secret="${this.secret}">`
        msg.message = msg.message.split(emote.code).join(img)
      })
      return msg
    }
  }
}