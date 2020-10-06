export const mutations = {
  addUser(state, name) {
    state.users.push(name);
  },
  registerName(state, obj) {
    state.myName = obj.name;
    state.gameMasterFlag = obj.gameMasterFlag;
  },
  setRoomId(state, roomId) {
    state.roomId = roomId;
  },
  setRoles(state, arr) {
    state.roles = arr;
  }
}