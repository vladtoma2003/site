<template>
  <q-page-container>
    <h1>Home Page</h1>
    <q-page class="row">
      <div v-for="image in localImages" :key="image.url" class="q-px-md">
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
  </q-page-container>
</template>

<script setup lang="ts">
import { storage, db, auth } from 'src/firebase/index.js';
import { getDownloadURL, listAll, ref as storageRef } from 'firebase/storage';
import { ref } from 'vue';
import { collection, doc, getDocs, getDoc, setDoc } from 'firebase/firestore';
import { Notify } from 'quasar';

interface Details {
  id: string;
  name: string;
  price?: string;
  description?: string;
  seller: string;
  email: string;
  url: string;
}

const localImages = ref<Details[]>([]);

async function getServerImages() {
  const usersRef = collection(db, 'users');
  const usersDoc = await getDocs(usersRef);
  const users = usersDoc.docs.map((doc) => doc.data());
  const images = users.map((user) => {
    const userImagesRef = storageRef(storage, user.uid);
    return userImagesRef;
  });

  const productsRef = collection(db, 'products');
  const productsDoc = await getDocs(productsRef);
  const products = productsDoc.docs.map((doc) => {
    return { id: doc.id, data: doc.data() as Details };
  });

  images.forEach(async (imageRef) => {
    const imageUrls = await listAll(imageRef);
    imageUrls.items.forEach(async (image) => {
      const url = await getDownloadURL(image);
      const name = image.name.split('.')[0];
      const uid = image.parent ? image.parent.name : 'Unknown Seller';
      const details = users.find((user) => user.uid === uid);
      const seller = details ? details.displayName : 'Unknown Seller';
      const mail = details ? details.email : 'Unknown Email';

      const product = products.find((prod) => prod.data.name === name);
      console.log(product);

      const price = product ? product.data.price : 'Unknown Price';
      const description = product
        ? product.data.description
        : 'Unknown Description';
      const currid = product ? product.id : 'Unknown ID';

      localImages.value.push({
        name: name,
        price: price,
        description: description,
        seller: seller,
        email: mail,
        url: url,
        id: currid,
      });
    });
  });
}
const addToCart = async (item: Details) => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      Notify.create({
        message: 'Please log in to add items to cart',
        color: 'negative',
        position: 'top',
      });
      return;
    }

    const userRef = doc(db, 'users', currentUser.uid);
    const userDoc = await getDoc(userRef);
    const userData = userDoc.data();
    const cart = userData ? userData.cart : [];

    cart.push({ id: item.id, url: item.url });
    await setDoc(userRef, { cart: cart }, { merge: true });
  } catch (error) {
    Notify.create({
      message: 'Error adding item to cart',
      color: 'negative',
      position: 'top',
    });
    console.log(error);
  }
};

getServerImages();
</script>
