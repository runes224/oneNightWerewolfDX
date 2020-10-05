export const getters = {
  getUsers(state) {
    return state.users;
  },
  getUsersNumber(state) {
    return state.users.length;
  }
}