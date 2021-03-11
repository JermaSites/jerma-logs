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

      const { data: globalEmotes } = await axios.get('https://api.betterttv.net/3/cached/emotes/global')
      commit('setGlobalEmotes', globalEmotes)

      const { data: channelEmotes } = await axios.get('https://api.betterttv.net/3/cached/users/twitch/23936415')
      commit('setChannelEmotes', channelEmotes.sharedEmotes)
    },
    async fetchBadges ({ commit, state }) {
      if (state.globalBadges && state.channelBadges && state.allBadges) return

      const { data: globalBadges } = await axios.get('https://badges.twitch.tv/v1/badges/global/display')
      commit('setGlobalBadges', globalBadges)

      const { data: channelBadges } = await axios.get('https://badges.twitch.tv/v1/badges/channels/23936415/display')
      commit('setChannelBadges', channelBadges)

      commit('setAllBadges', {
        badge_sets: {
          ...globalBadges.badge_sets, ...channelBadges.badge_sets
        }
      })
    }
  },
  modules: {
  }
})
