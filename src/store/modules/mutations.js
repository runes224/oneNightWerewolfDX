export const mutations = {
  addUser(state, name) {
    state.users.push(name);
  },
  setRoomId(state, roomId) {
    state.roomId = roomId;
  },
  setRoles(state, arr) {
    state.roles = arr;
  }
}