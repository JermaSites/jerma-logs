const IMG_STYLE = 'display: inline; vertical-align: middle; margin: -0.5rem 0;'

export default function () {
  const nuxtApp = useNuxtApp()

  // Per-request on the server (nuxtApp is created per request), per-session on
  // the client. Module-scope state would be shared across every SSR request.
  const emoteMap = (nuxtApp._emoteMap ??= shallowRef<EmoteMap>(new Map()))

  async function fetchEmotes() {
    if (emoteMap.value.size)
      return emoteMap.value

    try {
      const emotes = await $fetch<Emote[]>('/api/emotes')

      if (!emotes?.length) {
        console.warn('No emotes received from API')
        return emoteMap.value
      }

      emoteMap.value = new Map(emotes.map(emote => [emote.code, emote]))
    }
    catch (error) {
      console.error('Emote fetch error:', error)
    }

    return emoteMap.value
  }

  function parseEmotes(msg: string): string {
    // Process token by token to avoid running regex over HTML.
    // Whitespace runs are preserved; URLs are linkified; emote words become images.
    return msg.split(/(\s+)/).map((token) => {
      if (/^\s+$/.test(token))
        return token

      const safeToken = escapeHtml(token)

      if (/^https?:\/\//i.test(token))
        return `<a href="${safeToken}" target="_blank" rel="noopener noreferrer">${safeToken}</a>`

      // Look up the raw token — the map is keyed on unescaped emote codes.
      const emote = emoteMap.value.get(token)
      const url = emote?.urls?.[0]?.url

      if (emote && url) {
        const code = escapeHtml(emote.code)
        return `<img style="${IMG_STYLE}" src="${escapeHtml(url)}" width="28" height="28" alt="${code}" title="${code}">`
      }

      return safeToken
    }).join('')
  }

  return {
    fetchEmotes,
    parseEmotes,
  }
}
