import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import modules from './modules';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    modules: modules
  },
  plugins: [ createPersistedState({
    key: "oneNightWerewolf",
    overwrite: true,
    storage: window.sessionStorage
  }) ]
});
export default store;