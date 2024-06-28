<template>
  <div>
    <h1>User Profile</h1>
    <q-card>
      <q-card-section>
        <q-input
          label="First Name"
          v-model="user.firstName"
          :readonly="!isEditing.value"
        ></q-input>
        <q-input
          label="Last Name"
          v-model="user.lastName"
          :readonly="!isEditing.value"
        ></q-input>
        <q-input
          label="Email"
          v-model="user.email"
          :readonly="!isEditing.value"
        ></q-input>
      </q-card-section>
      <q-card-section>
        <q-btn
          class="full-width"
          label="Edit Profile"
          color="primary"
          v-if="!isEditing.value"
          @click="editUser"
        ></q-btn>
        <q-btn
          class="full-width"
          label="Save changes"
          color="primary"
          v-if="isEditing.value"
          @click="saveChanges"
        ></q-btn>
      </q-card-section>
    </q-card>
    <q-fab
      class="q-mr-md"
      icon="logout"
      label="Log Out"
      color="primary bottom-right"
      @click="logOut"
      :glossy="true"
      :hide-icon="true"
    ></q-fab>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { db } from 'src/firebase/index.js';
import { onMounted } from 'vue';
import { getDoc, doc, setDoc } from 'firebase/firestore';
import { auth } from 'src/firebase/index.js';
// import { Details } from 'src/functions';
import logout from 'src/firebase/firebase-logout';
import { useRouter } from 'vue-router';

const router = useRouter();

interface User {
  firstName: string;
  lastName: string;
  email: string;
  postedProducts: string[];
}
const user = ref<User>({
  firstName: '',
  lastName: '',
  email: '',
  postedProducts: [],
});

// const postedProds: Product[] = [];
// const postedProds = ref<Details[]>([]);

const isEditing = reactive({ value: false });

function editUser() {
  isEditing.value = true;
}

function saveChanges() {
  isEditing.value = false;
  updateUser();
}

// // modify the user parameters (name and email)
async function updateUser() {
  if (auth.currentUser) {
    const uid = auth.currentUser.uid;
    const userRef = doc(db, 'users', uid);
    const userDoc = {
      displayName: `${user.value.firstName} ${user.value.lastName}`,
      email: user.value.email,
    };
    await setDoc(userRef, userDoc, { merge: true });
  }
}

async function getUserData() {
  // get the current user from db using user.uid
  if (auth.currentUser) {
    const uid = auth.currentUser.uid;
    const docRef = await getDoc(doc(db, 'users', uid));

    if (docRef.exists()) {
      // split displayName into first and last name
      const displayName = docRef.data().displayName;
      const nameArray = displayName.split(' ');
      user.value.firstName = nameArray[0];
      user.value.lastName = nameArray[1];
      user.value.email = docRef.data().email;
      user.value.postedProducts = docRef.data().products;
    }
  }
  // await getProducts();
}

// async function getProducts() {
//   const productPromises = user.value.postedProducts.map(async (prod) => {
//     const productDetails = await getProductDetails(prod);
//     return productDetails;
//   });

//   // Wait for all product details to be fetched and resolved
//   const products = await Promise.all(productPromises);

//   const serverImages = await getServerImages(products);
//   postedProds.value = serverImages;
// }

async function logOut() {
  logout().then(() => {
    router.push('/LogInPage');
  });
}

onMounted(async () => {
  await getUserData();
});
</script>
