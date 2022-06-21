import { createRouter, createWebHashHistory } from 'vue-router';

const Home = () => import('../views/HomeView.vue');
const Login = () => import('../views/LoginView.vue');

import store from '@/store';

import {
  ROUTE_HOME,
  ROUTE_LOGIN,
} from './routes';

const authGuard = (to, from, next) => {
  if (store.getters.isAuthenticated) {
    next();
  } else {
    next(ROUTE_LOGIN);
  }
};

const routes = [
  {
    path: ROUTE_HOME,
    name: 'home',
    component: Home,
    beforeEnter: authGuard
  },
  {
    path: ROUTE_LOGIN,
    name: 'login',
    component: Login
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

// Clear the error on every navigation
router.afterEach(() => {
  store.commit('clearError');
});

export default router;
