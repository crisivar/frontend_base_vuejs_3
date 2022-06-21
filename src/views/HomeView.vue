<template>
  <Header />
  <main>
    <div class="container-fluid bg-white">
      <div class="container">
        <div class="row pt-5 mt-3">
          <p class="lead">
            test
          </p>
        </div>

      </div>
    </div>

  </main>
  <Footer />
</template>

<script>
import { defineAsyncComponent } from '@vue/runtime-core';

export default {
  components: {
    Header: defineAsyncComponent(() => import('../components/TheHeader.vue')),
    Footer: defineAsyncComponent(() => import('../components/TheFooter.vue'))
  },
  setup() {
    return {};
  }
};
</script>
