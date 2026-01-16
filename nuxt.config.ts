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
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'firebase-core': ['firebase/app'],
            'firebase-firestore': ['firebase/firestore'],
          },
        },
      },
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

  gtag: {
    id: 'G-51G4MFGEP0',
  },

  app: {
    head: {
      htmlAttrs: {
        lang: 'en',
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
      sameSite: 'none',
      secure: true,
      httpOnly: false,
    },
    storage: 'cookies',
  },

  runtimeConfig: {
    public: {
      firebaseApiUrl: 'https://firestore.googleapis.com/v1beta1/projects/jerma-logs/databases/(default)/documents:runQuery',
      twitchUsername: '',
      twitchId: '',
    },
    twitchApiBaseUrl: '',
    twitchClientId: '',
    twitchClientSecret: '',
  },

  typescript: {
    strict: true,
  },

  compatibilityDate: '2026-01-16',
})
