import { createStore } from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import user from './modules/user';

export default createStore({
  state: {
    isBusy: false,
    error: '',
    responseMessage: ''
  },
  mutations: {
    setBusy: (state) => (state.isBusy = true),
    clearBusy: (state) => (state.isBusy = false),
    setError: (state, error) => (state.error = error),
    setResponseMessage: (state, responseMessage) => (state.responseMessage = responseMessage),
    clearError: (state) => (state.error = ''),
    clearResponseMessage: (state) => (state.responseMessage = '')
  },
  getters: {},
  actions: {},
  modules: {
    user,
  },
  plugins: [
    createPersistedState({
      paths: ['user']
    })
  ]
});
