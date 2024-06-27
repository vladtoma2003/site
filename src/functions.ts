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

interface Product {
  id: string;
  data: Details;
}

interface CartItem {
  id: string;
  url: string;
  ammount: number;
}

async function getServerImages(productsParam?: Product[]) {
  const localImages = ref<Details[]>([]);
  // map the users to get their images
  const usersRef = collection(db, 'users');
  const usersDoc = await getDocs(usersRef);
  const users = usersDoc.docs.map((doc) => doc.data());
  const images = users.map((user) => {
    const userImagesRef = storageRef(storage, user.uid);
    return userImagesRef;
  });

  let products: Product[];
  if (productsParam) {
    products = productsParam;
  } else {
    const productsRef = collection(db, 'products');
    const productsDoc = await getDocs(productsRef);
    products = productsDoc.docs.map((doc) => {
      return { id: doc.id, data: doc.data() as Details };
    });
  }
  console.log(products);

  images.forEach(async (imageRef) => {
    const imageUrls = await listAll(imageRef);
    imageUrls.items.forEach(async (image) => {
      const name = image.name.split('.')[0];
      const product = products.find((prod) => prod.data.name === name);
      if (product) {
        const url = await getDownloadURL(image);
        const uid = image.parent ? image.parent.name : 'Unknown Seller';
        const details = users.find((user) => user.uid === uid);
        const seller = details ? details.displayName : 'Unknown Seller';
        const mail = details ? details.email : 'Unknown Email';

        // console.log(product);

        const price = product ? product.data.price : 'Unknown Price';
        const description = product
          ? product.data.description
          : 'Unknown Description';
        const currid = product ? product.id : 'Unknown ID';
        console.log('Prod');
        console.log(product);

        localImages.value.push({
          name: name,
          price: price,
          description: description,
          seller: seller,
          email: mail,
          url: url,
          id: currid,
        });
      }
    });
  });

  return localImages.value;
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

    if (item.seller === currentUser.displayName) {
      Notify.create({
        message: 'You cannot add your own items to the cart',
        color: 'negative',
        position: 'top',
      });
      return;
    }

    const userRef = doc(db, 'users', currentUser.uid);
    const userDoc = await getDoc(userRef);
    const userData = userDoc.data();
    const cart = userData ? userData.cart : [];

    if (!cart.find((cartItem: CartItem) => cartItem.id === item.id)) {
      cart.push({ id: item.id, url: item.url, ammount: 1 });
      await setDoc(userRef, { cart: cart }, { merge: true });
    } else {
      const currItem = cart.find(
        (cartItem: CartItem) => cartItem.id === item.id
      );
      currItem.ammount++;
      await setDoc(userRef, { cart: cart }, { merge: true });
    }
  } catch (error) {
    Notify.create({
      message: 'Error adding item to cart',
      color: 'negative',
      position: 'top',
    });
    console.log(error);
  }
};

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

export { getServerImages, addToCart, getProductDetails };
export type { Details, Product };
