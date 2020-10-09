export const getters = {
  myName(state) {
    return state.myName;
  },
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