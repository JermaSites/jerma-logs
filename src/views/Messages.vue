<template>
  <div class="container">
    <div class="section">
      <nav class="breadcrumb level" style="margin-bottom: 3rem" aria-label="breadcrumbs">
        <ul class="level-left">
          <li>
            <router-link
              :to="{ name: 'Home' }"
            >
              Home
            </router-link>
          </li>
          <li class="is-active"><a href="#" aria-current="page">{{ month }} {{ year }}</a></li>
        </ul>
        <div class="level-right">
          <b-button
            type="is-light"
            icon-left="sort-variant"
            outlined
            @click="toggleSort"
          >
          </b-button>
        </div>
      </nav>
      <MessageList
        :year="year"
        :month="month"
        :layout="layout"
        :sort="sort"
      />
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
  },
  data () {
    return {
      layout: 'SeperatedDaySimple',
      sort: 'desc'
    }
  },
  methods: {
    toggleSort () {
      this.sort = this.sort === 'desc' ? 'asc' : 'desc'
    }
  }
}
</script>
