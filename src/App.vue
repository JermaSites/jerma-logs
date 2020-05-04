<template>
  <div id="app">
    <TheHeader />
    <router-view/>
  </div>
</template>

<script>
export default {
  components: {
    TheHeader: () => import('@/components/TheHeader')
  },
  data () {
    return {
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
  }
}
</script>

<style lang="scss">
body {
  min-height: 100vh;
  background-color: $secondary
}
</style>
