<template>
  <div class="container">
    <div class="row d-flex flex-column min-vh-100 justify-content-center align-items-center">
      <div class="col-md-4">
        <div class="login-form bg-white mt-4 p-4 rounded">
          <form novalidate @submit.prevent="onSubmit()">
            <div class="form-group mb-3">
              <label for="username" class="form-label text-muted small">Usuario</label>
              <input v-model="model.username" type="text" name="username" class="form-control" />
            </div>
            <div class="form-group mb-3">
              <label for="password" class="form-label text-muted small">Contraseña</label>
              <input v-model="model.password" type="password" name="password" class="form-control" />
            </div>
            <div class="form-group mb-3 text-center">
              <button class="btn btn-primary" type="submit" :disabled="isBusy">
                <span v-if="isBusy" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                Ingresar
              </button>
            </div>
          </form>
        </div>
        <div class="m-4">
          <img class="rounded mb-1 mx-auto d-block" src="@/assets/images/cenicana_horizontal.png" width="110" />
          <p class="text-center text-muted small">
            Cenicaña © 2022. Derechos reservados. <a href="https://www.cenicana.org" class="nav-link px-2 text-muted">www.cenicana.org</a>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, computed, watch } from 'vue';
import store from '@/store';

import { useToast } from 'vue-toastification';

export default {
  setup() {
    const model = reactive({ username: '', password: '' });

    let error = computed(() => store.state.error);

    const toast = useToast();

    function onSubmit() {
      store.dispatch('login', model);
    }

    watch(error, () => {
      if (error.value) {
        toast.error(error.value);
      }
    });

    return {
      model,
      onSubmit,
      isBusy: computed(() => store.state.isBusy),
      error
    };
  }
};
</script>
