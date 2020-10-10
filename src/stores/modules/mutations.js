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
  setNightPeriodSecond(state, num) {
    state.nightPeriodSecond = num;
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
  }
}