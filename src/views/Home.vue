<template>
  <div class="container">
    <div class="section">
      <div
        v-for="(date, i) in dates"
        :key="i"
        class="columns"
      >
        <router-link
          :to="{ name: 'Messages', params: { year: date.year, month: date.month } }"
          custom v-slot="{ navigate }"
        >
          <div @click="navigate" @keypress.enter="navigate" role="link" class="column">
            {{ date.month }} {{ date.year }}
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home',
  computed: {
    dates () {
      const startDate = this.$moment('2020-05')
      const endDate = this.$moment()
      const interim = startDate.clone()
      const timeValues = []

      // eslint-disable-next-line no-unmodified-loop-condition
      while (endDate > interim || interim.format('M') === endDate.format('M')) {
        timeValues.unshift({
          year: interim.format('YYYY'),
          month: interim.format('MMMM')
        })
        interim.add(1, 'month')
      }

      return timeValues
    }
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
</style>
