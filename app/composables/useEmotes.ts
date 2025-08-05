import linkifyStr from 'linkify-string'

const emoteMap = reactive<EmoteMap>(new Map())
const isLoading = ref(false)
const error = ref<string | null>(null)

export default function () {
  async function fetchEmotes() {
    try {
      const emotes = await $fetch<Emote[]>('/api/emotes')

      if (!emotes || emotes.length === 0) {
        console.warn('No emotes received from API')
        return
      }

      emotes.forEach((emote) => {
        emoteMap.set(emote.code, emote)
      })

      return emoteMap
    }
    catch (err) {
      error.value = 'Failed to fetch emotes'
      console.error('Emote fetch error:', err)
    }
  }

  function parseEmotes(msg: string): string {
    return linkifyStr(msg, { target: '_blank', rel: 'noopener noreferrer' }).replace(/\b\w+\b/g, (word) => {
      const emote = emoteMap.get(word)

      if (!emote || !emote.urls?.[0]?.url)
        return word

      const emoteName = emote.code
      const imgSrc = emote.urls[0].url

      return `<img style="display: inline; vertical-align: middle; margin: -0.5rem 0;" src="${imgSrc}" width="28" height="28" alt="${emoteName}" title="${emoteName}" loading="lazy">`
    })
  }

  return {
    fetchEmotes,
    parseEmotes,
    isLoading: readonly(isLoading),
    error: readonly(error),
  }
}
