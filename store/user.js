const state = {
  authUser: null
}
const mutations = {
  SET_USER(state, response) {
    state.authUser = response;
    //Object.assign(state.user, response);
  }
}
const actions = {
  setUser: ({
    commit
  }, response) => {
    commit('SET_USER', response);
  }
}
const getters = {
  authUser: state => {
    return state.authUser;
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
