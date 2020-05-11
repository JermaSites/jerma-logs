import bttvChannel from '@/assets/BTTV-channel-emotes.json'
import bttvGlobal from '@/assets/BTTV-global-emotes.json'

export default {
  methods: {
    parseEmotes (msg) {
      return this.parseTwitchEmotes(msg)
      // return this.parseBTTVEmotes(this.parseTwitchEmotes(msg))
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
        const img = `<img src="${emoteURL}" style="vertical-align: text-bottom">`

        const emoteName = message.substring(firstLocationStart, firstLocationEnd)
        msg.message = msg.message.split(emoteName).join(img)
      }
      return msg.message
    },
    parseBTTVEmotes (msg) {
      const { urlTemplate } = bttvGlobal
      const globalEmotes = bttvGlobal.emotes
      const channelEmotes = bttvChannel.emotes
      const emotes = [...globalEmotes, ...channelEmotes]
      emotes.forEach(emote => {
        const emoteURL = urlTemplate.replace('{{id}}', emote.id).replace('{{image}}', '1x')
        const img = `<img src="${emoteURL}" style="vertical-align: text-bottom">`
        msg = msg.split(emote.code).join(img)
      })
      return msg
    }
  }
}
