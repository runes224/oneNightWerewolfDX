export const mutations = {
  addUser(state, name) {
    state.users.push(name);
  },
  setRoles(state, arr) {
    state.roles = arr;
  },
  registerName(state, roomId) {
    state.roomId = roomId;
  }
}