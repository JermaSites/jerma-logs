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

</style>
