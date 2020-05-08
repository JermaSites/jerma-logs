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
        <b-dropdown aria-role="list" v-model="layout">
            <button class="button" slot="trigger">
                <b-icon icon="view-dashboard"></b-icon>
            </button>

            <b-dropdown-item
              v-for="(layout, i) in layouts"
              :key="i"
              :value="layout.value"
              aria-role="listitem"
            >
              <div class="media">
                <b-icon class="media-left" icon="earth"></b-icon>
                <div class="media-content">
                  <h3>{{ layout.name }}</h3>
                  <small>{{ layout.desc }}</small>
                </div>
              </div>
            </b-dropdown-item>
        </b-dropdown>
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
    MessageList: () => import('@/components/MessageList')
  },
  data () {
    return {
      layout: 'SeperatedDaySimple',
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
      ],
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
