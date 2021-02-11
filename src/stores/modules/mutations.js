export const mutations = {
  setUsers(state, arr) {
    state.users = arr;
  },
  registerName(state, obj) {
    state.myName = obj.name;
    state.gameMasterFlag = obj.gameMasterFlag;
  },
  setRoomId(state, roomId) {
    state.roomId = roomId;
  },
  setNightPeriodSecond(state, num) {
    state.nightPeriodSecond = num;
  },
  setDayPeriodMinute(state, num) {
    state.dayPeriodMinute = num;
  },
  setRoles(state, arr) {
    state.roles = arr;
  },
  setMyRole(state, str) {
    state.myRole = str;
  },
  setInsideCards(state, arr) {
    state.insideCards = arr;
  },
  setOutsideCards(state, arr) {
    state.outsideCards = arr;
  },
  addMessage(state, msg) {
    state.messages.push(msg);
  },
  clearMessages(state) {
    state.messages = [];
  },
  finishGame(state) {
    state.finishedGameFlag = true;
  },
  startGame(state) {
    state.finishedGameFlag = false;
    state.doneNightActionFlag = false;
    state.gameCount++;
  },
  setVoteState(state, bool) {
    state.startVotingFlag = bool;
  },
  doneNightAction(state) {
    state.doneNightActionFlag = true;
  }
};