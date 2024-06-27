<template>
  <div>
    <h1>Items List:</h1>
    <div v-for="item in $data.items" :key="item.id">
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

<script lang="ts">
import { db, auth } from 'src/firebase/index.js';
import { defineComponent } from 'vue';
import { collection, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';

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

export default defineComponent({
  data() {
    return {
      items: [] as Item[],
    };
  },
  async mounted() {
    const currentUid = auth.currentUser ? auth.currentUser.uid : '';
    if (!currentUid) {
      return;
    }
    const userData = doc(db, 'users', currentUid);
    const userDoc = await getDoc(userData);
    const user = userDoc.data();

    const cart = user ? user.cart : [];
    // console.log(cart);

    const productDocs = await getDocs(collection(db, 'products'));
    const products = productDocs.docs.map((doc) => {
      return { id: doc.id, data: doc.data() as Item };
    });

    // console.log(products);

    const items = products.filter((product) => {
      return cart.some((cartItem: Cart) => cartItem.id === product.id);
    });
    this.items = items.map((item) => {
      return item.data;
    });

    const allUsers = await getDocs(collection(db, 'users'));

    items.forEach((item) => {
      item.data.url = cart.find(
        (cartItem: Cart) => cartItem.id === item.id
      )?.url;
      const currUser = allUsers.docs.find(
        (user) => user.id === item.data.owner
      );
      const userData = currUser ? currUser.data() : {};
      console.log(userData);
      console.log('ITEMEMTMEMTEMM');
      console.log(item);
      item.data.seller = userData.displayName;
      item.data.email = userData.email;
    });
  },
  methods: {
    async removeItem(item: Item) {
      const currentUid = auth.currentUser ? auth.currentUser.uid : '';
      if (!currentUid) {
        return;
      }
      const userData = doc(db, 'users', currentUid);
      const userDoc = await getDoc(userData);
      const user = userDoc.data();
      const newCart = user ? user.cart : [];
      const index = newCart.findIndex(
        (cartItem: Item) => cartItem.id === item.id
      );
      if (index !== -1) {
        newCart.splice(index, 1);
      }
      await setDoc(userData, { cart: newCart }, { merge: true });

      this.items = newCart;
    },
  },
});
</script>
