<template>
  <div>
    <q-card>
      <h3>Post a product on the page</h3>
      <q-form @submit.prevent="submitProd">
        <q-card-section>
          <q-input label="Product Name" v-model="product.name"></q-input>
          <q-input label="Price" v-model="product.price"></q-input>
          <q-input label="Description" v-model="product.description"></q-input>
          <q-uploader
            label="Upload an image"
            accept="image/*"
            v-model="image.productImage"
            @added="uploadImage"
            :multiple="false"
          ></q-uploader>
          <br />
          <q-btn
            class="full-width"
            label="Post Product"
            type="submit"
            color="primary"
          ></q-btn>
        </q-card-section>
      </q-form>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { auth } from 'src/firebase/index.js';
import { ref as storageRef, uploadBytes } from 'firebase/storage';
import { db, storage } from 'src/firebase/index.js';
import { addDoc, collection, getDoc, doc, setDoc } from 'firebase/firestore';
import { Notify } from 'quasar';

interface Product {
  name: string;
  price: string;
  description: string;
  owner: string;
  imageName: string;
}

interface Image {
  productImage: File;
}

const currentUid = auth.currentUser ? auth.currentUser.uid : '';

const product = reactive<Product>({
  name: '',
  price: '',
  description: '',
  owner: currentUid,
  imageName: '',
});

const image = reactive<Image>({
  productImage: new File([], ''),
});

const submitProd = async () => {
  console.log(product);
  console.log(image);
  const path = `${currentUid}/${product.name}.${
    image.productImage.type.split('/')[1]
  }`;
  product.imageName = path;
  console.log(product);
  const prodRef = collection(db, 'products');
  try {
    const lastProd = await addDoc(prodRef, product);
    // get the prduct ID
    await uploadImage([image.productImage]);
    console.log(image.productImage);
    await addProdID(lastProd.id);
  } catch (error) {
    // notify the user of the error
    Notify.create({
      message: 'Error posting product',
      color: 'negative',
      position: 'top',
    });
  }
};

async function uploadImage(files: readonly File[]): Promise<void> {
  image.productImage = files[0];
  console.log(image.productImage);
  const type = image.productImage.type.split('/')[1];
  const path = `${currentUid}/${product.name}.${type}`;
  console.log(path);
  const imgRef = storageRef(storage, path);
  await uploadBytes(imgRef, image.productImage);
}

async function addProdID(prodID: string) {
  const usersRef = doc(db, 'users', currentUid);
  const userRef = getDoc(usersRef);

  if (userRef) {
    const userDoc = (await userRef).data();
    if (userDoc) {
      const userProd = userDoc.products;
      userProd.push(prodID);
      await setDoc(usersRef, { products: userProd }, { merge: true });
    }
  }
}
</script>
