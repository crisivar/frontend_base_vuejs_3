import api from '@/services/api';
import urls from '@/services/urls';

const userService = {
  login,
  getProfile
};

async function login(model) {
  return await api.post(urls.API_AUTH_LOGIN, model, false); //unsecured
}

async function getProfile(){
  return await api.get(urls.API_AUTH_PROFILE);
}

export default userService;
