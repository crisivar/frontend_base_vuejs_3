<template>
  <nav class="border-bottom">
    <div class="container-fluid d-flex flex-wrap">
      <ul class="nav me-auto text-small">

      </ul>

      <ul class="nav text-small">
        <li class="nav-item">
          <a v-if="profile" href="#" class="nav-link link-secondary px-2 text-small"
            ><small>{{ profile.first_name + ' ' + profile.last_name }}</small></a
          >
        </li>
      </ul>

      <div class="flex-shrink-0 dropdown">
        <a id="dropdownUser2" href="#" class="d-block link-secondary text-decoration-none dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
          <i class="fs-4 bi-person-circle"></i>
        </a>
        <ul class="dropdown-menu text-small shadow" aria-labelledby="dropdownUser2">
          <li>
            <span v-if="isAuthenticated"
              ><a class="dropdown-item" href="#" @click.prevent="onLogout"><i class="bi bi-arrow-bar-right"></i> Cerrar sesión </a></span
            >
          </li>
        </ul>
      </div>
    </div>
  </nav>
  <header class="py-3 shadow">
    <div id="navbarColor03" class="container-fluid d-flex flex-wrap justify-content-center mt-3">
      <router-link to="/">
        <img src="@/assets/images/cenicana_horizontal.png" width="450" class="d-none d-sm-block" />

      </router-link>
    </div>
  </header>
</template>
<script>
import store from '@/store';
import { computed, onMounted } from 'vue';

export default {
  setup() {
    let profile = computed(() => store.getters.profile);

    const getProfile = async () => {
      if (Object.keys(profile.value).length === 0) await store.dispatch('getProfile');
    };

    onMounted(getProfile);

    return {
      isAuthenticated: computed(() => store.getters.isAuthenticated),
      profile,
      onLogout: () => store.dispatch('logout')
    };
  }
};
</script>
