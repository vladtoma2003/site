<template>
  <div>
    <h1>Items List:</h1>
    <div v-for="item in items" :key="item.id">
      <img :src="item.url" alt="Loaded Image" />
      <p>Item name: {{ item.name }}</p>
      <p>price: {{ item.price }}</p>
      <p>Description: {{ item.description }}</p>
      <p>Seller: {{ item.seller }}</p>
      Contact info: {{ item.email }}
      <q-btn color="primary" @click="() => removeItem(item)" :rounded="true">
        <q-icon name="remove" />
      </q-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { db, auth } from 'src/firebase/index.js';
// import { defineComponent } from 'vue';
import { collection, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';
import { Notify } from 'quasar';
import { onAuthStateChanged } from 'firebase/auth';
import { ref } from 'vue';

interface Item {
  id: string;
  name: string;
  price: string;
  description: string;
  seller: string;
  owner: string;
  email: string;
  url: string;
}

interface Cart {
  id: string;
  url: string;
}

const items = ref([] as Item[]);

async function getCartItems() {
  // Wait for the user to be logged in
  const currentUid = await new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        unsubscribe(); // Unsubscribe once we have the user state
        if (user) {
          resolve(user.uid);
        } else {
          Notify.create({
            message: 'Please log in to view your cart',
            color: 'negative',
            position: 'top',
          });
          resolve(''); // Resolve with empty string if no user is logged in
        }
      },
      reject
    );
  });

  const userDoc = await getDoc(doc(db, 'users', currentUid as string));
  const user = userDoc.data();

  const cart = user ? user.cart : [];

  const productDocs = await getDocs(collection(db, 'products'));
  const products = productDocs.docs.map((doc) => {
    return { id: doc.id, data: doc.data() as Item };
  });

  const cartItems = products.filter((product) => {
    // id, url
    return cart.some((cartItem: Cart) => cartItem.id === product.id);
  });

  const allUsers = await getDocs(collection(db, 'users'));

  cartItems.forEach((item) => {
    // get the seller and email
    item.data.url = cart.find((cartItem: Cart) => cartItem.id === item.id)?.url;
    const currUser = allUsers.docs.find((user) => user.id === item.data.owner);
    const userData = currUser ? currUser.data() : {};
    item.data.seller = userData.displayName;
    item.data.email = userData.email;
  });

  console.log(cartItems);
  items.value = cartItems.map((item) => item.data);
}

async function removeItem(item: Item) {
  const currentUid = auth.currentUser ? auth.currentUser.uid : '';
  if (!currentUid) {
    return;
  }
  const userData = doc(db, 'users', currentUid);
  const userDoc = await getDoc(userData);
  const user = userDoc.data();
  const newCart = user ? user.cart : [];
  const index = newCart.findIndex((cartItem: Item) => cartItem.id === item.id);
  if (index !== -1) {
    newCart.splice(index, 1);
  }
  await setDoc(userData, { cart: newCart }, { merge: true });

  items.value = newCart;
}

getCartItems();
</script>
