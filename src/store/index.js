import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    globalEmotes: null,
    channelEmotes: null
  },
  mutations: {
    setGlobalEmotes (state, payload) {
      state.globalEmotes = payload
    },
    setChannelEmotes (state, payload) {
      state.channelEmotes = payload
    }
  },
  actions: {
    async fetchEmotes ({ commit }) {
      const { data: globalEmotes } = await axios.get('https://api.betterttv.net/3/cached/emotes/global')
      commit('setGlobalEmotes', globalEmotes)

      const { data: channelEmotes } = await axios.get('https://api.betterttv.net/3/cached/users/twitch/23936415')
      commit('setChannelEmotes', channelEmotes.sharedEmotes)
    }
  },
  modules: {
  }
})
