<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          label="Home screen"
          color="pink"
          @click="() => $router.push('/HomePage')"
        ></q-btn>
        <q-btn
          label="Index Page"
          color="primary"
          @click="() => $router.push('/')"
        ></q-btn>
        <div class="q-ml-auto q-gutter-x-sm">
          <q-btn
            label="Log In"
            color="secondary"
            @click="() => $router.push('/LogInPage')"
          ></q-btn>
          <q-btn
            label="Register"
            color="accent"
            @click="() => $router.push('/RegisterPage')"
          ></q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
defineOptions({
  name: 'MainLayout',
});
import { useRouter } from 'vue-router';
const $router = useRouter();
</script>
