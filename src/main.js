import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import NumberInputSpinner from 'vue-number-input-spinner'
import router from './router'
import store from './stores/store'
import Socket from './utils/socket'
import VueCompositionAPI from '@vue/composition-api'
import VueClipboard from 'vue-clipboard2'

Vue.config.productionTip = false;
Vue.component('number-input-spinner', NumberInputSpinner);
Vue.prototype.$websocket = Socket;
Vue.use(VueCompositionAPI);
Vue.use(VueClipboard);

new Vue({
  router,
  vuetify,
  store,
  // css,
  render: h => h(App)
}).$mount('#app');