// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    "@pinia/nuxt",
    "@pinia-plugin-persistedstate/nuxt",
    "@nuxtjs/tailwindcss",
    "nuxt-headlessui",
    "@vueuse/nuxt",
    "@nuxtjs/color-mode",
    "@nuxtjs/robots",
    "@nuxt/image",
  ],
  nitro: {
    storage: {
      redis: {
        driver: "redis",
        port: process.env.NUXT_UPSTASH_REDIS_PORT,
        host: process.env.NUXT_UPSTASH_REDIS_HOST,
        username: process.env.NUXT_UPSTASH_REDIS_USERNAME,
        password: process.env.NUXT_UPSTASH_REDIS_PASSWORD,
        db: 0,
        tls: {},
      },
    },
  },
  app: {
    head: {
      htmlAttrs: {
        lang: "en",
      },
    },
  },
  image: {
    format: ["avif", "webp", "png"],
  },
  piniaPersistedstate: {
    cookieOptions: {
      sameSite: "strict",
      maxAge: 1 * 60 * 60 * 24 * 400,
    },
  },
  colorMode: {
    classSuffix: "",
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
});
