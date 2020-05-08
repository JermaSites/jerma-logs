<template>
  <div>
    <div v-for="msg in messages" :key="msg.id" class="columns" :class="{ 'new-day': msg.newDay }">
      <div class="column is-narrow is-primary">
        <span class="has-text-grey-light">{{ msg.sentAt }}</span>
      </div>
      <div class="column">
        <span
          class="has-text-light"
          v-linkified:options="{
            attributes: { rel: 'noopener noreferrer nofollow' }
          }"
        >
          {{ msg.message }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SeperatedDayChrono',
  props: {
    messages: {
      type: Array,
      required: true
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

.new-day {
  border-top: 3px solid $jerma-pink;
}

.columns:last-child {
  border-bottom: 3px solid $jerma-pink;
}
</style>
