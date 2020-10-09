export const getters = {
  users(state) {
    return state.users;
  },
  roles(state) {
    return state.roles;
  },
  messages(state) {
    return state.messages;
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