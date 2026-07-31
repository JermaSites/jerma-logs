import type { ShallowRef } from 'vue'

declare module '#app' {
  interface NuxtApp {
    /**
     * Emote/badge lookups, held on the Nuxt app instance rather than at module
     * scope so the server keeps them per request, and deliberately kept out of
     * the payload — the client fetches its own copy from the (24h-cacheable)
     * API instead of paying ~500kB of inline JSON on every page load.
     */
    _emoteMap?: ShallowRef<EmoteMap>
    _badgeMap?: ShallowRef<BadgeMap>
  }
}

export {}
