// Transpiler for older browsers
import 'core-js/stable'
// optional but required for transforming generator fns.
import 'regenerator-runtime/runtime'

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@mdi/font/css/materialdesignicons.css'
import {
  Button,
  Dropdown,
  Field,
  Icon,
  Modal,
  Select,
  Skeleton,
  Switch,
  Tooltip
} from 'buefy'
import { firestorePlugin } from 'vuefire'
import linkify from 'vue-linkify'
import moment from 'moment-timezone'
import Meta from 'vue-meta'

import './registerServiceWorker'

Vue.prototype.$moment = moment

Vue.directive('linkified', linkify)

Vue.use(Meta)

Vue.use(firestorePlugin)

Vue.use(Button)
Vue.use(Dropdown)
Vue.use(Field)
Vue.use(Icon)
Vue.use(Modal)
Vue.use(Select)
Vue.use(Skeleton)
Vue.use(Switch)
Vue.use(Tooltip)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
