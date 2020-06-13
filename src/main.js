import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import NumberInputSpinner from 'vue-number-input-spinner'
// import css from '/assets/styles.css';

Vue.config.productionTip = false
Vue.component('number-input-spinner', NumberInputSpinner);

new Vue({
  vuetify,
  // css,
  render: h => h(App)
}).$mount('#app')
