<template>
  <div class="container is-fluid">
    <div class="columns is-centered">
      <div class="column is-three-fifths-fullhd is-three-quarters-desktop is-full">
        <MessageList />
      </div>
    </div>
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
