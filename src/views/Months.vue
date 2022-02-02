<template>
  <div class="container">
    <nav class="breadcrumb level settings" style="margin: 0;" aria-label="breadcrumbs">
      <ul class="level-left">
        <li>
          <router-link
            :to="{ name: 'Home' }"
          >
            Home
          </router-link>
        </li>
        <li class="is-active"><a href="#" aria-current="page">{{ $route.params.year }}</a></li>
      </ul>
    </nav>
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
      <div v-for="(month, i) in sortedMonths" :key="i" class="columns">
        <router-link
          :to="{ name: 'Messages', params: { year: $route.params.year, month } }"
          custom
          v-slot="{ navigate }"
        >
          <div
            @click="navigate"
            @keypress.enter="navigate"
            role="link"
            class="column"
          >{{ month }}</div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { db } from '../db'

export default {
  name: 'Months',
  data () {
    return {
      loading: false,
      months: []
    }
  },
  computed: {
    sortedMonths () {
      const orderedMonths = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December']

      return this.months.slice(0).sort((a, b) => orderedMonths.indexOf(b) - orderedMonths.indexOf(a))
    }
  },
  async mounted () {
    this.loading = true
    const querySnapshot = await db.collection('messagesByYear').doc(this.$route.params.year).collection('messagesByMonth').get()
    querySnapshot.forEach((doc) => {
      this.months.push(doc.id)
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
.settings {
  position: sticky;
  padding: 1rem;
  top: 0;
  background: $secondary
}
</style>
