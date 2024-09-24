import { createStore } from 'vuex';

const store = createStore({
  state: {
    accessToken: null,
  },
  mutations: {
    setAccessToken(state, token) {
      state.accessToken = token;
    },
  },
  actions: {
    updateAccessToken({ commit }, token) {
      commit('setAccessToken', token);
    },
  },
});

export default store;
