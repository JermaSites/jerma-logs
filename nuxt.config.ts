import process from 'node:process'
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: [
    'dayjs-nuxt',
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt',
    'nuxt-headlessui',
    '@vueuse/nuxt',
    '@nuxtjs/color-mode',
    '@nuxtjs/robots',
    '@nuxt/image',
    '@nuxt/fonts',
    '@nuxt/ui',
  ],

  dayjs: {
    plugins: ['utc', 'timezone', 'relativeTime', 'advancedFormat'],
    defaultLocale: 'en',
    defaultTimezone: 'America/New_York',
  },

  image: {
    format: ['avif', 'webp', 'png'],
  },

  piniaPersistedstate: {
    cookieOptions: {
      sameSite: 'strict',
      maxAge: 1 * 60 * 60 * 24 * 400,
    },
    storage: 'cookies',
  },

  colorMode: {
    classSuffix: '',
  },

  runtimeConfig: {
    public: {
      twitchUsername: process.env.NUXT_TWITCH_USERNAME,
      twitchId: process.env.NUXT_TWITCH_ID,
    },
    twitchApiBaseUrl: process.env.NUXT_TWITCH_API_BASE_URL,
    twitchClientId: process.env.NUXT_TWITCH_CLIENT_ID,
    twitchClientSecret: process.env.NUXT_TWITCH_CLIENT_SECRET,
  },

  typescript: {
    strict: true,
  },

  compatibilityDate: '2024-07-07',
})
