<template>
  <div class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title has-text-white">Settings</p>
      <button class="delete" aria-label="close" @click="$parent.close()" />
    </header>
    <section class="modal-card-body">
      <b-field label="Layout">
        <b-select v-model="layout" placeholder="Choose a layout">
          <option
            v-for="layout in layouts"
            :key="layout.name"
            :value="layout.value"
          >
            {{ layout.name }}
          </option>
        </b-select>
      </b-field>
    </section>
    <footer class="modal-card-foot">
      <button class="button is-secondary" @click="saveChanges">Save changes</button>
      <button class="button is-jerma-pink" @click="$parent.close()">Cancel</button>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'SettingsModal',
  data () {
    return {
      layout: 'MessageListSimple',
      layouts: [
        {
          name: 'Simple',
          desc: 'Simple layout',
          value: 'MessageListSimple'
        },
        {
          name: 'Seperated',
          desc: 'Messages are seperated by day',
          value: 'SeperatedDaySimple'
        },
        {
          name: 'Seperated & Chronological',
          desc: 'Messages are seperated by day and sorted by chronological order',
          value: 'SeperatedDayChrono'
        }
      ]
    }
  },
  methods: {
    saveChanges () {
      localStorage.layout = this.layout
      this.$emit('saved', this.layout)
      this.$parent.close()
    }
  },
  created () {
    if (localStorage.layout) {
      this.layout = localStorage.layout
    }
  }
}
</script>

<style scoped lang="scss">
.modal-card-body {
  min-height: 200px;
}
</style>
