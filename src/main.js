import App from "./App.vue";
import NumberInputSpinner from "vue-number-input-spinner";
import Socket from "./utils/socket";
import Vue from "vue";
import VueClipboard from "vue-clipboard2";
import VueCompositionAPI from "@vue/composition-api";
import router from "./router";
import store from "./stores/store";
import vuetify from "./plugins/vuetify";

Vue.config.productionTip = false;
Vue.component("NumberInputSpinner", NumberInputSpinner);
Vue.prototype.$websocket = Socket;
Vue.use(VueCompositionAPI);
Vue.use(VueClipboard);

new Vue({
  router,
  vuetify,
  store,
  // css,
  created() {
    sessionStorage.clear();
  },
  render: (h) => h(App)
}).$mount("#app");
