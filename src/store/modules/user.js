import userService from '@/services/user.service';
import router from '@/router';
import api from '@/services/api';
import urls from '@/services/urls';

const state = {
  token: '',
  refreshToken: '',
  expiration: Date.now(),
  profile: {}
};

const getters = {
  isAuthenticated: (state) => state.token && state.token.length > 0, // && state.expiration > Date.now(),
  token: (state) => state.token,
  refreshToken: (state) => state.refreshToken,
  profile: (state) => state.profile
};

const actions = {
  login: async ({ commit }, model) => {
    try {
      commit('setBusy', { root: true });
      commit('clearError', { root: true });
      commit('clearResponseMessage', { root: true });

      const result = await userService.login(model);

      if (result.data.access) {
        commit('setToken', result.data);
        router.push('/');
      } else if (result.data) {
        commit('setError', result.data, { root: true });
      } else {
        commit('setError', 'Authentication Failed', { root: true });
      }
    } catch (error) {
      commit('setError', 'Usuario o contraseña incorrectos', { root: true });
    } finally {
      commit('clearBusy', { root: true });
    }
  },
  setToken: ({ commit }, model) => {
    commit('setToken', model);
  },
  logout: ({ commit }) => {
    commit('clearToken');
    router.push('/login');
  },
  getProfile: async ({ commit }) => {
    try {
      const result = await userService.getProfile();
      if (result.data) {
        commit('setProfile', result.data);
      }
    } catch (error) {
      commit('setError', error.response, { root: true });
    } finally {
      commit('clearBusy', { root: true });
    }
  }
};

const mutations = {
  setToken: (state, model) => {
    state.token = model.access;
    if (model.refresh) state.refreshToken = model.refresh;
    const date = new Date();
    date.setMinutes(date.getMinutes() + 15);

    state.expiration = date;
  },
  clearToken: (state) => {
    state.token = '';
    state.refresh = '';
    state.expiration = '';
    state.profile = {};
  },
  setProfile: (state, model) => {
    state.profile = model;
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
