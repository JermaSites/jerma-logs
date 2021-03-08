<template>
  <div id="app" :class="{ trotr }">
    <TheHeader />
    <router-view/>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  components: {
    TheHeader: () => import('@/components/TheHeader')
  },
  data () {
    return {
      pass: 'trotr',
      code: [],
      trotr: false,
      title: 'Jerma Logs',
      description: 'Jerma Twitch Chat Logs',
      url: 'https://jerma-logs.web.app',
      image: 'https://jerma-logs.web.app' + require('@/assets/logo.png')
    }
  },
  metaInfo () {
    return {
      title: this.title,
      meta: [
        { name: 'description', content: this.description },
        // OpenGraph data (Most widely used)
        { property: 'og:title', content: this.title },
        { property: 'og:site_name', content: this.title },
        // The list of types is available here: http://ogp.me/#types
        { property: 'og:type', content: 'website' },
        // Should the the same as your canonical link, see below.
        { property: 'og:url', content: this.url },
        { property: 'og:image', content: this.image },
        // Often the same as your meta description, but not always.
        { property: 'og:description', content: this.description },
        // Google / Schema.org markup:
        { itemprop: 'name', content: this.title },
        { itemprop: 'description', content: this.description },
        { itemprop: 'image', content: this.image }
      ]
    }
  },
  created () {
    this.fetchEmotes().catch(console.error)
    this.fetchBadges().catch(console.error)
  },
  mounted () {
    window.addEventListener('keypress', (e) => {
      e.preventDefault()
      this.code.push(e.key)
      this.code.splice(0, this.code.length - this.pass.length)

      const enteredCode = this.code.join('').toString()

      if (enteredCode.includes(this.pass)) {
        this.trotr = !this.trotr
      }
    })
  },
  methods: {
    ...mapActions(['fetchEmotes', 'fetchBadges'])
  }
}
</script>

<style lang="scss">
body {
  min-height: 100vh;
}

.trotr {
  font-family: "Comic Sans MS", "Comic Sans", cursive;
}
</style>
