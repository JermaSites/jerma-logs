<template>
  <header>
    <div class="container is-fluid">
      <div class="columns is-centered">
        <div class="column is-three-fifths-fullhd is-three-quarters-desktop is-full">
          <div class="columns is-vcentered">
            <div class="column is-narrow">
              <figure class="image is-96x96">
                <img src="@/assets/logo.png">
              </figure>
            </div>
            <div class="column">
              <span class="site-name">Jerma Logs</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
header {
  display: flex;
  align-items: center;
  padding: 1rem 0;
  margin-bottom: 2rem;
  background-color: $primary;
}

.site-name {
  font-size: 3rem
}
</style>
