<template>
  <div class="container">
    <MessageList />
  </div>
</template>

<script>
export default {
  name: 'Home',
  components: {
    MessageList: () => import('@/components/MessageList')
  }
}
</script>
