import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import NumberInputSpinner from 'vue-number-input-spinner'
import router from './router'

Vue.config.productionTip = false
Vue.component('number-input-spinner', NumberInputSpinner);

new Vue({
  router,
  vuetify,
  // css,
  render: h => h(App)
}).$mount('#app')
