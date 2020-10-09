import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import NumberInputSpinner from 'vue-number-input-spinner'
import router from './router'
import store from './stores/store'
import Socket from './utils/socket'

Vue.config.productionTip = false
Vue.component('number-input-spinner', NumberInputSpinner);
Vue.prototype.$websocket = Socket;

new Vue({
  router,
  vuetify,
  store,
  // css,
  render: h => h(App)
}).$mount('#app')