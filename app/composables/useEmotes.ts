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
    // Process token by token to avoid running regex over HTML.
    // Whitespace runs are preserved; URLs are linkified; emote words become images.
    return msg.split(/(\s+)/).map((token) => {
      if (/^\s+$/.test(token))
        return token

      if (/^https?:\/\//i.test(token))
        return `<a href="${token}" target="_blank" rel="noopener noreferrer">${token}</a>`

      const emote = emoteMap.get(token)
      if (emote?.urls?.[0]?.url)
        return `<img style="display: inline; vertical-align: middle; margin: -0.5rem 0;" src="${emote.urls[0].url}" width="28" height="28" alt="${emote.code}" title="${emote.code}">`

      return token
    }).join('')
  }

  return {
    fetchEmotes,
    parseEmotes,
    isLoading: readonly(isLoading),
    error: readonly(error),
  }
}
