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
          label="Post a product"
          color="primary"
          v-if="isLoggedIn"
          @click="() => $router.push('/postProduct')"
        ></q-btn>
        <div class="]">
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
            v-if="isLoggedIn"
            @click="() => $router.push('/userProfile')"
            label="Profile"
            color="primary"
          ></q-btn>
          <q-btn
            v-if="isLoggedIn"
            flat
            @click="() => $router.push('/cart')"
            label="Cart"
            color="primary"
          ></q-btn>
          <q-btn
            v-if="isLoggedIn"
            flat
            @click="logOut"
            label="Log Out"
            color="negative"
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
import logout from 'src/firebase/firebase-logout';
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
const logOut = async () => {
  logout().then(() => {
    $router.push('/LogInPage');
  });
};
</script>
