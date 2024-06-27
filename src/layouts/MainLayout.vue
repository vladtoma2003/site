<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          label="Home screen"
          icon="home"
          color="pink"
          @click="() => $router.push('/HomePage')"
        ></q-btn>
        <div class="q-px-lg">
          <q-btn
            label="Post a product"
            icon="monetization_on"
            color="blue"
            v-if="isLoggedIn"
            @click="() => $router.push('/postProduct')"
          ></q-btn>
        </div>
        <div class="q-px-xl">
          <q-toolbar>
            <q-input
              filled
              v-model="search"
              placeholder="Search for products"
              @keyup.enter="searchProducts"
            ></q-input>
          </q-toolbar>
        </div>
        <div class="q-ml-auto q-gutter-x-sm">
          <q-btn
            label="Log In"
            color="secondary"
            v-if="!isLoggedIn"
            @click="() => $router.push('/LogInPage')"
          ></q-btn>
          <q-btn
            label="Register"
            color="accent"
            v-if="!isLoggedIn"
            @click="() => $router.push('/RegisterPage')"
          ></q-btn>
          <q-btn
            icon="shopping_cart"
            v-if="isLoggedIn"
            flat
            @click="() => $router.push('/cart')"
            label="Cart"
            color="primary"
          ></q-btn>
          <q-btn
            v-if="isLoggedIn"
            @click="() => $router.push('/userProfile')"
            label="Profile"
            icon="person"
            color="primary"
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
import { ref } from 'vue';
import { getAuth } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';

const isLoggedIn = ref(false);
const auth = getAuth();

const search = ref('');
const searchProducts = () => {
  $router.push({ path: '/search', query: { search: search.value } });
};

// dynamically detect if user is logged in
onAuthStateChanged(auth, (user) => {
  isLoggedIn.value = !!user;
});

const $router = useRouter();
</script>
