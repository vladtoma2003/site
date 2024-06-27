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
// import { auth } from 'src/firebase/index.js';

// const user = auth.currentUser;

const localImages = ref<Details[]>([]);

// interface Image {
//   description: string;
//   email: string;
//   id: string;
//   name: string;
//   price: string;
//   seller: string;
//   url: string;
// }

getServerImages().then((images) => {
  // remove the images that are posted by the currently logged user
  // if (!user) {
  //   localImages.value = images;
  //   return;
  // }
  // images = images.filter((image) => image.name.split(' ')[0] !== user?.uid);
  localImages.value = images;
  console.log('ASDASFDAS');
  console.log(images);
  // console.log('AAAASSAF');
  // console.log(localImages.value);
});

// async function getUnOwnedImages(images: []Image) {
//   images.forEach(img => {

//   });
// }

const router = useRouter();
function goToProductPage(id: string) {
  router.push({ path: '/product', query: { id } });
}
</script>
