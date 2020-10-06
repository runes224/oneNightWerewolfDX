export const actions = {
  addUser({commit}, name) {
    commit('addUser', name);
  },
  setRoomId({commit}, roomId) {
    commit('setRoomId', roomId);
  }
}