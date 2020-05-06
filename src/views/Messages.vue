<template>
  <div class="container">
    <div class="section">
      <nav class="breadcrumb" style="margin-bottom: 3rem" aria-label="breadcrumbs">
        <ul>
          <li>
            <router-link
              :to="{ name: 'Home' }"
            >
              Home
            </router-link>
          </li>
          <li class="is-active"><a href="#" aria-current="page">{{ month }} {{ year }}</a></li>
        </ul>
      </nav>
      <MessageList :year="year" :month="month" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home',
  props: {
    year: {
      type: String,
      required: true
    },
    month: {
      type: String,
      required: true
    }
  },
  components: {
    MessageList: () => import('@/components/MessageList')
  }
}
</script>
