<template>
  <q-page-container>
    <h1>Home Page</h1>
    <q-page class="row">
      <div v-for="image in localImages" :key="image.url" class="q-px-md">
        <img
          :src="image.url"
          alt="Loaded Image"
          @click="() => goToProductPage(image.id)"
        />
        <!-- </router-link> -->
        <p>Item name: {{ image.name }}</p>
        <p>price: {{ image.price }}</p>
        <p>Description: {{ image.description }}</p>
        <p>Seller: {{ image.seller }}</p>
        <p>Contact info: {{ image.email }}</p>
        <q-btn
          label="Add to cart"
          color="primary"
          @click="() => addToCart(image)"
        >
          <q-icon name="add" />
        </q-btn>
      </div>
    </q-page>
  </q-page-container>
</template>

<script setup lang="ts">
import { getServerImages, addToCart, Details } from 'src/functions';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const localImages = ref<Details[]>([]);
getServerImages().then((images) => {
  localImages.value = images;
});

const router = useRouter();
function goToProductPage(id: string) {
  router.push({ path: '/product', query: { id } });
}
</script>
