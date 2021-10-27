import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    globalEmotes: null,
    channelEmotes: null,
    globalBadges: null,
    channelBadges: null,
    allBadges: null
  },
  mutations: {
    setGlobalEmotes (state, payload) {
      state.globalEmotes = payload
    },
    setChannelEmotes (state, payload) {
      state.channelEmotes = payload
    },
    setGlobalBadges (state, payload) {
      state.globalBadges = payload
    },
    setChannelBadges (state, payload) {
      state.channelBadges = payload
    },
    setAllBadges (state, payload) {
      state.allBadges = payload
    }
  },
  actions: {
    async fetchEmotes ({ commit, state }) {
      if (state.globalEmotes && state.channelEmotes) return

      const globalEmotesPromise = axios.get('https://api.betterttv.net/3/cached/emotes/global')
      const channelEmotesPromise = axios.get('https://api.betterttv.net/3/cached/users/twitch/23936415')

      const [globalEmotes, channelEmotes] = await Promise.all([globalEmotesPromise, channelEmotesPromise])

      commit('setGlobalEmotes', globalEmotes.data)
      commit('setChannelEmotes', channelEmotes.data.sharedEmotes)
    },
    async fetchBadges ({ commit, state }) {
      if (state.globalBadges && state.channelBadges && state.allBadges) return

      const globalBadgesPromise = axios.get('https://badges.twitch.tv/v1/badges/global/display')
      const channelBadgesPromise = axios.get('https://badges.twitch.tv/v1/badges/channels/23936415/display')

      const [globalBadges, channelBadges] = await Promise.all([globalBadgesPromise, channelBadgesPromise])

      commit('setGlobalBadges', globalBadges.data)
      commit('setChannelBadges', channelBadges.data)

      commit('setAllBadges', {
        badge_sets: {
          ...globalBadges.data.badge_sets, ...channelBadges.data.badge_sets
        }
      })
    }
  },
  modules: {
  }
})
