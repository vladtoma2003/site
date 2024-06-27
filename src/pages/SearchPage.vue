<template>
  <div>
    <h1>Search Page</h1>
    <q-page class="row">
      <div v-for="image in localItems" :key="image.url" class="q-px-md">
        <img :src="image.url" alt="Loaded Image" />
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
  </div>
</template>

<script setup lang="ts">
import { collection, getDocs } from 'firebase/firestore';
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { db } from 'src/firebase/index';
import { Details, getServerImages, Product, addToCart } from 'src/functions';

const route = useRoute();
const searchString = ref('');

watch(
  () => route.query.search,
  (newSearch) => {
    searchString.value = newSearch as string;
  },
  { immediate: true }
);

const searchResults = ref<Product[]>([]);

const localItems = ref<Details[]>([]);

watch(searchString, async (newSearchString) => {
  await getProducts(newSearchString);
  let prodList: Product[];
  prodList = searchResults.value;
  localItems.value = await getServerImages(prodList);
});

async function getProducts(search: string) {
  const productDocs = await getDocs(collection(db, 'products'));
  const products = productDocs.docs.map((doc) => {
    // Explicitly cast the data to the expected structure
    const data = doc.data() as {
      name: string;
      price?: string;
      description?: string;
      seller: string;
      email: string;
      url: string;
    };
    return { id: doc.id, data: data };
  });

  const filteredProducts = products.filter((product) => {
    const productNameLower = product.data.name?.toLowerCase() ?? '';
    const searchLower = search.toLowerCase();

    return productNameLower.includes(searchLower);
  });

  console.log(filteredProducts);
  searchResults.value = filteredProducts.map((product) => ({
    id: product.id,
    data: {
      id: product.id, // Include the id inside the data object
      ...product.data,
    },
  }));
}
</script>
