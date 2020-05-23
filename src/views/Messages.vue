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
        <li class="is-active"><a href="#" aria-current="page">{{ month }} {{ year }}</a></li>
      </ul>
      <div class="level-right">
        <b-button
          type="is-light"
          icon-left="sort-variant"
          outlined
          @click="toggleSort"
        ></b-button>

        <b-button
          type="is-light"
          icon-left="cog"
          outlined
          @click="show = true"
        ></b-button>

        <b-modal
          :active.sync="show"
          has-modal-card
          trap-focus
          :destroy-on-hide="false"
          aria-role="dialog"
          aria-modal
        >
          <SettingsModal @saved="layout = $event" />
        </b-modal>
      </div>
    </nav>
    <div class="section" style="padding-top: 15px">
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
  name: 'Messages',
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
    MessageList: () => import('@/components/MessageList'),
    SettingsModal: () => import('@/components/SettingsModal')
  },
  data () {
    return {
      layout: 'MessageListSimple',
      show: false,
      sort: 'asc'
    }
  },
  methods: {
    toggleSort () {
      this.sort = this.sort === 'desc' ? 'asc' : 'desc'
    }
  },
  watch: {
    layout (newLayout) {
      localStorage.layout = newLayout
    },
    sort (newSort) {
      localStorage.sort = newSort
    }
  },
  created () {
    if (localStorage.layout) this.layout = localStorage.layout
    if (localStorage.sort) this.sort = localStorage.sort
  }
}
</script>

<style lang="scss" scoped>
.settings {
  position: sticky;
  padding: 1rem;
  top: 0;
  background: $secondary
}
</style>
