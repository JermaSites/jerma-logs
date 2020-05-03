import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { Loading } from 'buefy'
import { firestorePlugin } from 'vuefire'
import linkify from 'vue-linkify'
import moment from 'moment-timezone'
import Meta from 'vue-meta'

Vue.prototype.$moment = moment

Vue.directive('linkified', linkify)

Vue.use(Meta)

Vue.use(firestorePlugin)

Vue.use(Loading)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
