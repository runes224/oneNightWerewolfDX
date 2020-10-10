export const actions = {
  addUser({commit}, name) {
    commit('addUser', name);
  },
  registerName({commit}, obj) {
    commit('registerName', obj);
  },
  setMyRole({commit}, str) {
    commit('setMyRole', str);
  },
  setRoomId({commit}, roomId) {
    commit('setRoomId', roomId);
  },
  setNightPeriodSecond({commit}, num) {
    commit('setNightPeriodSecond', num);
  },
  setRoles({commit}, arr) {
    commit('setRoles', arr)
  },
  setInsideCards({commit}, arr) {
    commit('setInsideCards', arr)
  },
  setOutsideCards({commit}, arr) {
    commit('setOutsideCards', arr)
  },
  addMessage({commit}, arr) {
    commit('addMessage', arr);
  },
  clearMessages({commit}) {
    commit('clearMessages');
  }
}