export const getters = {
  users(state) {
    return state.users;
  },
  roles(state) {
    return state.roles;
  },
  getUsersNumber(state) {
    return state.users.length;
  },
  isGameMaster(state) {
    return state.gameMasterFlag;
  }
}