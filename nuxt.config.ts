import process from 'node:process'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: [
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',
    '@vueuse/nuxt',
    '@nuxt/image',
    '@nuxt/ui',
    'nuxt-gtag',
    '@nuxtjs/seo',
    '@nuxtjs/algolia',
    '@nuxt/fonts',
  ],

  vite: {
    // Pre-bundling these keeps the dev server from re-optimising (and reloading)
    // the first time a page pulls in dayjs/firebase.
    optimizeDeps: {
      include: [
        '@vue/devtools-core',
        '@vue/devtools-kit',
        'dayjs',
        'dayjs/plugin/advancedFormat',
        'dayjs/plugin/relativeTime',
        'dayjs/plugin/timezone',
        'dayjs/plugin/utc',
        'firebase/app',
        'firebase/firestore',
        'firebase/functions',
      ],
    },
  },

  sitemap: {
    zeroRuntime: true,
  },

  site: {
    url: 'https://logs.jerma.io',
    name: 'Jerma Logs',
    description: 'Jerma985\'s twitch chat logs',
    defaultLocale: 'en',
  },

  ogImage: {
    enabled: false,
  },

  css: ['~/assets/css/main.css'],

    icon: {
    clientBundle: {
      scan: true
    }
  },

  gtag: {
    id: 'G-51G4MFGEP0',
  },

  app: {
    head: {
      htmlAttrs: {
        lang: 'en',
      },
      bodyAttrs: {
        class: 'min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-700 dark:text-slate-200',
      },
      link: [
        { rel: 'icon', type: 'image/png', href: '/logo.png' },
        { rel: 'manifest', href: '/manifest.json', crossorigin: 'use-credentials' },
      ],
    },
  },

  image: {
    format: ['avif', 'webp', 'png'],
  },

  piniaPluginPersistedstate: {
    cookieOptions: {
      maxAge: 60 * 60 * 24 * 400,
      sameSite: 'lax',
      secure: true,
      httpOnly: false,
    },
    storage: 'cookies',
  },

  runtimeConfig: {
    public: {
      firebaseApiUrl: 'https://firestore.googleapis.com/v1beta1/projects/jerma-logs/databases/(default)/documents:runQuery',
      twitchUsername: 'jerma985',
      twitchId: '23936415',
    },
    twitchApiBaseUrl: process.env.NUXT_TWITCH_API_BASE_URL,
    twitchClientId: process.env.NUXT_TWITCH_CLIENT_ID,
    twitchClientSecret: process.env.NUXT_TWITCH_CLIENT_SECRET,
  },

  typescript: {
    strict: true,
  },

  compatibilityDate: '2026-01-16',
})
