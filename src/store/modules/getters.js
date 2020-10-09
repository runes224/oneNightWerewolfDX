export const getters = {
  users(state) {
    return state.users;
  },
  roles(state) {
    return state.roles;
  },
  roomId(state) {
    return state.roomId;
  },
  getUsersNumber(state) {
    return state.users.length;
  },
  isGameMaster(state) {
    return state.gameMasterFlag;
  }
}