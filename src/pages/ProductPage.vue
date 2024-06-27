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
import { getDoc, doc } from 'firebase/firestore';
import { db } from 'src/firebase/index.js';
import { Details, getServerImages, Product, addToCart } from 'src/functions';
import { onMounted, ref } from 'vue';

const route = useRoute();
const id = route.query.id as string;

async function getProductDetails(id: string) {
  const productDoc = await getDoc(doc(db, 'products', id));

  const productData = productDoc.data() as {
    name: string;
    price?: string;
    description?: string;
    seller: string;
    email: string;
    url: string;
  };

  return { id: productDoc.id, data: { id: id, ...productData } };
}

const localImages = ref<Details[]>([]);

onMounted(async () => {
  const product: Product = await getProductDetails(id);

  const products = [product];

  localImages.value = await getServerImages(products);
});
</script>
