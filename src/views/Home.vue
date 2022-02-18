<template>
  <div class="container">
    <div class="section">
      <div v-if="loading">
        <div v-for="i in 6" :key="i" class="columns">
          <div class="column is-narrow is-primary">
            <b-skeleton width="200" />
          </div>
          <div class="column">
            <b-skeleton />
          </div>
        </div>
      </div>
      <div v-for="(year, i) in sortedYears" :key="i" class="columns">
        <router-link
          :to="{ name: 'Months', params: { year } }"
          custom
          v-slot="{ navigate }"
        >
          <div
            @click="navigate"
            @keypress.enter="navigate"
            role="link"
            class="column"
          >{{ year }}</div>
        </router-link>
      </div>
    </div>

    <div class="section">
      <a href="https://ko-fi.com/moduspwnens" target="_blank" class="kofi-button">
        <img src="@/assets/kofi_logo.png" alt="Ko-fi">
      </a>
    </div>
  </div>
</template>

<script>
import { db } from '../db'

export default {
  name: 'Home',
  data () {
    return {
      loading: false,
      years: []
    }
  },
  computed: {
    sortedYears () {
      return this.years.slice(0).reverse()
    }
  },
  async mounted () {
    this.loading = true
    const querySnapshot = await db.collection('messagesByYear').get()
    querySnapshot.forEach((doc) => {
      this.years.push(doc.id)
    })
    this.loading = false
  }
}
</script>

<style lang="scss" scoped>
.columns:nth-child(even) {
  background-color: $accent;
}
.columns:nth-child(odd) {
  background-color: $primary;
}

.column:hover {
  cursor: pointer;
  background-color: $jerma-pink;
}

.kofi-button {
  position: fixed;
  right: 2rem;
  bottom: 1.5rem;

  img {
    width: 50px;
  }
}
</style>
