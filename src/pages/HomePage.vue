<template>
  <q-page-container>
    <h1>Home Page</h1>
    <q-page class="row">
      <div v-for="image in localImages" :key="image.url" class="q-px-xl">
        <img
          :src="image.url"
          alt="Loaded Image"
          @click="() => goToProductPage(image.id)"
        />
        <p>Item name: {{ image.name }}</p>
        <p>price: {{ image.price }}</p>
        <p style="max-width: 250px">Description: {{ image.description }}</p>
        <p>Seller: {{ image.seller }}</p>
        <p>Contact info: {{ image.email }}</p>
        <q-btn
          label="Add to cart"
          color="primary"
          v-if="buyer.buyer"
          @click="() => addToCart(image)"
        >
          <q-icon name="add" />
        </q-btn>
        <q-btn
          label="Edit Product"
          color="primary"
          @click="() => toggleEdit(image)"
          v-if="!buyer.buyer"
        >
          <q-icon name="edit" />
        </q-btn>
        <div v-if="isEditing" class="modal-overlay">
          <form class="modal-content">
            <!-- Form fields go here -->
            <q-input
              v-model="newProd.name"
              label="Product Name"
              outlined
              dense
            ></q-input>
            <q-input
              v-model="newProd.price"
              label="Price"
              outlined
              dense
            ></q-input>
            <q-input
              v-model="newProd.description"
              label="Description"
              outlined
              dense
            ></q-input>
            <q-uploader
              label="Upload an image"
              accept="image/*"
              v-model="imageee.productImage"
              @added="uploadImage"
              :multiple="false"
            ></q-uploader>
            <button
              type="button"
              :disabled="!imageUploaded"
              @click="
                edit([imageee.productImage]);
                Notify.create({
                  message: 'Product updated',
                  color: 'positive',
                  position: 'top',
                });
              "
            >
              Submit
            </button>
            <button type="button" @click="toggleEdit(emptyDetails)">
              Cancel
            </button>
          </form>
        </div>
      </div>
    </q-page>
  </q-page-container>
</template>

<script setup lang="ts">
import {
  getServerImages,
  addToCart,
  Details,
  getProductDetails,
  Product,
  dbProducts,
  editProductDetails,
} from 'src/functions';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { db, auth } from 'src/firebase/index';
import { getDoc, doc } from 'firebase/firestore';
import { onMounted } from 'vue';
import { onAuthStateChanged } from 'firebase/auth';
import { Notify } from 'quasar';
import { reactive } from 'vue';

const currentUserId = ref<string>('');

const localImages = ref<Details[]>([]);

const imageUploaded = ref<boolean>(false);

async function uploadImage(files: readonly File[]): Promise<void> {
  imageee.productImage = files[0];
  imageUploaded.value = true;
}

interface Image {
  productImage: File;
}

const imageee = reactive<Image>({
  productImage: new File([], ''),
});

async function waitForUser() {
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
  currentUserId.value = currentUid as string;
}

interface Buyy {
  buyer: boolean;
}

const buyer = ref<Buyy>({ buyer: true });
const isEditing = ref<boolean>(false);

const id = ref<string>('');
const newProd = ref<dbProducts>({
  name: '',
  price: '',
  description: '',
  owner: '',
  imageName: '',
});

const emptyDetails = ref<Details>({
  id: '',
  name: '',
  price: '',
  description: '',
  seller: '',
  email: '',
  url: '',
});

function toggleEdit(image: Details) {
  id.value = image.id;
  newProd.value.name = image.name;
  newProd.value.price = image.price ? image.price : '';
  newProd.value.description = image.description ? image.description : '';
  newProd.value.owner = currentUserId.value;
  newProd.value.imageName = newProd.value.name;
  isEditing.value = !isEditing.value;
  imageUploaded.value = false;
}

async function edit(files: File[]) {
  const path = `${currentUserId.value}/${newProd.value.name}.${
    imageee.productImage.type.split('/')[1]
  }`;
  newProd.value.imageName = path;
  imageee.productImage = files[0];

  router.push('/HomePage');
  await editProductDetails(id.value, newProd.value, files[0]);
  isEditing.value = false;
}

async function getPageContent() {
  if (currentUserId.value) {
    const currentUserData = await getDoc(doc(db, 'users', currentUserId.value));
    const currentUser = currentUserData.data();
    console.log(currentUser);
    if (currentUser && currentUser.isSeller) {
      console.log('SELLER');
      buyer.value.buyer = false;
      const prducts: Product[] = [];
      for (const product of currentUser.products) {
        const productDetails = await getProductDetails(product);
        prducts.push(productDetails);
      }
      getServerImages(prducts).then((images) => {
        localImages.value = images;
      });
    } else {
      getServerImages().then((images) => {
        localImages.value = images;
      });
    }
  } else {
    // no user logged in
    getServerImages().then((images) => {
      localImages.value = images;
    });
  }
}

onMounted(async () => {
  await waitForUser();
  await getPageContent();
  buyer.value.buyer;
});

const router = useRouter();
function goToProductPage(id: string) {
  router.push({ path: '/product', query: { id } });
}
</script>

<style scoped>
.modal-overlay {
  position: fixed; /* Positioning relative to the viewport */
  top: 0;
  left: 0;
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  background-color: rgba(0, 0, 0, 0.5); /* Black background with opacity */
  display: flex;
  justify-content: center; /* Center horizontally */
  align-items: center; /* Center vertically */
  z-index: 1000; /* Ensure it's on top of other content */
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 90%; /* Adjust based on your form size */
  max-width: 500px; /* Maximum width */
}
</style>
