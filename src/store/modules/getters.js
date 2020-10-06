export const getters = {
  users(state) {
    return state.users;
  },
  getUsersNumber(state) {
    return state.users.length;
  },
  isGameMaster(state) {
    return state.gameMasterFlag;
  }
}