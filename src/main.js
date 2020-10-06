import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import NumberInputSpinner from 'vue-number-input-spinner'
import router from './router'
import store from './store/store'

Vue.config.productionTip = false
Vue.component('number-input-spinner', NumberInputSpinner);
Vue.prototype.$websocket = {
  connection: new WebSocket(
    "wss://oy4l1o06be.execute-api.ap-northeast-1.amazonaws.com/prod"
  )
};

new Vue({
  router,
  vuetify,
  store,
  // css,
  render: h => h(App)
}).$mount('#app')
