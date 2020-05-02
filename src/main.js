import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Buefy from 'buefy'
// import 'buefy/dist/buefy.css'
import { firestorePlugin } from 'vuefire'
import linkify from 'vue-linkify'
import VueMoment from 'vue-moment'

Vue.use(VueMoment)

Vue.directive('linkified', linkify)

Vue.use(firestorePlugin)

Vue.use(Buefy)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
