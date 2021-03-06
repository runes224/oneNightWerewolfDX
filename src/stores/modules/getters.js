export const getters = {
  myName(state) {
    return state.myName;
  },
  myRole(state) {
    return state.myRole;
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
  dayPeriodMinute(state) {
    return state.dayPeriodMinute;
  },
  getUsersNumber(state) {
    return state.users.length;
  },
  isGameMaster(state) {
    return state.gameMasterFlag;
  },
  isFinishedGame(state) {
    return state.finishedGameFlag;
  },
  isDoneNightAction(state) {
    return state.doneNightActionFlag;
  },
  isStartVoting(state) {
    return state.startVotingFlag;
  },
  getGameCount(state) {
    return state.gameCount;
  }
};