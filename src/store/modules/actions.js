export const actions = {
  addUser({commit}, name){
    console.log(name)
    commit('addUser', name);
  },
  setRoomId({commit}, roomId){
    commit('setRoomId', roomId);
  }
}