import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import NumberInputSpinner from 'vue-number-input-spinner';

Vue.config.productionTip = false
Vue.component('number-input-spinner', NumberInputSpinner);

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')
