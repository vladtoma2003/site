import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/IndexPage.vue') }],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },

  {
    path: '/HomePage',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/HomePage.vue') }],
  },

  {
    path: '/LoginPage',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/LogInPage.vue') }],
  },

  {
    path: '/RegisterPage',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/RegisterPage.vue') }],
  },

  {
    path: '/userProfile',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/UserProfile.vue') }],
  },
  {
    path: '/postProduct',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/PostProduct.vue') }],
  },
  {
    path: '/cart',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/CartPage.vue') }],
  },
  {
    path: '/search',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/SearchPage.vue') }],
  },
  {
    path: '/product',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/ProductPage.vue') }],
  },
];

export default routes;
