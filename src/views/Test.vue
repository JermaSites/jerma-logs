<template>
  <div class="container">
    <div>
      <button @click="requestNotificationPermission">request notification permission</button>
      <button @click="sendNotification">send notification</button>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({}),
  methods: {
    async requestNotificationPermission () {
      const response = await Notification.requestPermission()
      console.log(response)
    },
    sendNotification () {
      const notification = new Notification('This is a notification', {
        body: 'lorem',
        icon: 'https://logs.jerma.io/logo.png',
        badge: 'https://logs.jerma.io/logo.png',
        silent: true
      })

      console.log(notification)
    }
  }
}
</script>

<style>

</style>
