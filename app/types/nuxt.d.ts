import type dayjs from 'dayjs'
import type { FirebaseApp } from 'firebase/app'
import type { Firestore } from 'firebase/firestore'
import type { Functions } from 'firebase/functions'
import type { ShallowRef } from 'vue'

declare module '#app' {
  interface NuxtApp {
    /**
     * Injections from `app/plugins`, declared by hand because Nuxt's generated
     * `InjectionType<A extends Plugin>` no longer matches a plugin module's
     * namespace object, so every `provide` infers as `unknown`.
     */
    $dayjs: typeof dayjs
    $app: FirebaseApp
    $firestore: Firestore
    $functions: Functions
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
