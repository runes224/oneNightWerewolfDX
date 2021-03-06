export const actions = {
  setUsers({commit}, arr) {
    commit('setUsers', arr);
  },
  registerName({commit}, obj) {
    commit('registerName', obj);
  },
  finishGame({commit}) {
    commit('finishGame');
  },
  startGame({commit}) {
    commit('startGame');
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
  setDayPeriodMinute({commit}, num) {
    commit('setDayPeriodMinute', num);
  },
  setRoles({commit}, arr) {
    commit('setRoles', arr);
  },
  setInsideCards({commit}, arr) {
    commit('setInsideCards', arr);
  },
  setOutsideCards({commit}, arr) {
    commit('setOutsideCards', arr);
  },
  addMessage({commit}, arr) {
    commit('addMessage', arr);
  },
  clearMessages({commit}) {
    commit('clearMessages');
  },
  setVoteState({commit}, bool) {
    commit('setVoteState', bool);
  },
  doneNightAction({commit}) {
    commit('doneNightAction');
  }
};