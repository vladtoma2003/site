<template>
  <div>
    <div v-for="image in localImages" :key="image.url" class="q-px-md">
      <h1>{{ image.name }}</h1>
      <img :src="image.url" alt="Loaded Image" />
      <!-- </router-link> -->
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
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import {
  Details,
  getServerImages,
  Product,
  addToCart,
  getProductDetails,
} from 'src/functions';
import { onMounted, ref } from 'vue';

const route = useRoute();
const id = route.query.id as string;

const localImages = ref<Details[]>([]);

onMounted(async () => {
  const product: Product = await getProductDetails(id);

  const products = [product];

  localImages.value = await getServerImages(products);
});
</script>
