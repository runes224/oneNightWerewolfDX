export const actions = {
  addUser({commit}, name) {
    commit('addUser', name);
  },
  registerName({commit}, obj) {
    commit('registerName', obj);
  },
  setRoomId({commit}, roomId) {
    commit('setRoomId', roomId);
  },
  setRoles({commit}, arr) {
    commit('setRoles', arr);
  }
}