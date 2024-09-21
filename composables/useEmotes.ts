import type { EmoteMap } from '@/types'
import linkifyHtml from 'linkify-html'
// import { NuxtImg } from '#components'
// import { h } from 'vue'

const emoteMap = reactive<EmoteMap>(new Map())

async function fetchEmotes() {
  const { data: emotes } = await useFetch('/api/emotes')

  emotes.value?.forEach((emote) => {
    emoteMap.set(emote.code, emote)
  })

  return emoteMap
}

// function parseEmotes(msg: string) {
//   const tokens = msg.split(/\b(\w+)\b/) // Splits the message into words

//   return tokens.map((token) => {
//     const emote = emoteMap.get(token)

//     if (!emote || !emote.urls?.[0]?.url) {
//       return token
//     }

//     const emoteName = emote.code
//     const imgSrc = emote.urls[0].url

//     // Return a render function for the NuxtImg component
//     return h(NuxtImg, {
//       src: imgSrc,
//       width: 28,
//       height: 28,
//       alt: emoteName,
//       title: emoteName,
//       style: { display: 'inline', verticalAlign: 'middle', margin: '-0.5rem 0' },
//       loading: 'lazy',
//     })
//   })
// }

function parseEmotes(msg: string): string {
  return linkifyHtml(msg).replace(/\b\w+\b/g, (word) => {
    const emote = emoteMap.get(word)

    if (!emote || !emote.urls?.[0]?.url)
      return word

    const emoteName = emote.code
    const imgSrc = emote.urls[0].url

    return `<img style="display: inline; vertical-align: middle; margin: -0.5rem 0;" src="${imgSrc}" width="28" height="28" alt="${emoteName}" title="${emoteName}" loading="lazy">`
  })
}

export function useEmotes() {
  return { fetchEmotes, parseEmotes }
}
