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
  }
}
</script>

<style lang="scss">
// Import Bulma and Buefy styles
@import "@/scss/_variables";
// @import "~buefy/src/scss/buefy";

body {
  min-height: 100vh;
  background-color: $secondary
}
</style>
