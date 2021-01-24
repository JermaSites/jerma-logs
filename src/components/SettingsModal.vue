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
      <b-field>
        <b-switch v-model="notifications">Notifications</b-switch>
      </b-field>
    </section>
    <footer class="modal-card-foot">
      <button class="button is-secondary" @click="saveChanges">Save changes</button>
      <button class="button is-jerma-pink" @click="$parent.close()">Cancel</button>
    </footer>
  </div>
</template>

<script>
import { db, messaging } from '@/db'

export default {
  name: 'SettingsModal',
  data () {
    return {
      notifications: false,
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

    switch (Notification.permission) {
      case 'default':
      case 'denied':
        this.notifications = false
        break
      case 'granted':
        this.notifications = true
    }
  },
  watch: {
    notifications (value) {
      if (value) {
        messaging.getToken({ vapidKey: 'BBzAmYU-18pvRnM2vrdMwWz3vHZfT6BErkcg9L7A0IghKslryeDwuZ0sSiMGD75__jsjpjbO2xkVVxKIa6UE3W8' })
          .then(token => {
            console.log('token', token)
            db.collection('subscribers').doc(token).set({ token })
          })
          .catch(err => {
            console.error('Unable to get permission to notify', err)
            this.notifications = false
          })
      } else {
        // unsub from notifications
      }
    }
  }
}
</script>

<style scoped lang="scss">
.modal-card-body {
  min-height: 200px;
}
</style>
