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
  insideCards(state) {
    return state.insideCards;
  },
  outsideCards(state) {
    return state.outsideCards;
  },
  roomId(state) {
    return state.roomId;
  },
  nightPeriodSecond(state) {
    return state.nightPeriodSecond;
  },
  getUsersNumber(state) {
    return state.users.length;
  },
  isGameMaster(state) {
    return state.gameMasterFlag;
  }
}