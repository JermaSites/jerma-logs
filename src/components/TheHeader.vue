<template>
  <header>
    <div class="container">
      <div class="section">
        <figure class="image is-96x96">
          <img src="@/assets/logo.png" alt="Jerma Joy">
        </figure>

        <h1>Jerma Logs</h1>
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
  background-color: $primary;
}

h1 {
  font-size: 2.5rem;
  margin-left: 1rem;
}

.section {
  display: flex;
  align-items: center;
}
</style>
