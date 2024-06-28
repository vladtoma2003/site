import { auth } from './index.js';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { Loading, Notify } from 'quasar';
import { db } from './index.js';
import { doc, setDoc } from 'firebase/firestore';

const addUser = async (user, data) => {
  console.log('AAAAAAAAAAAAAAAAAAAAAAAA');
  console.log(data);
  await setDoc(doc(db, 'users', user.uid), {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    products: [],
    cart: [],
    isBuyer: data.isBuyer || true, // Provide a default value of false if undefined
    isSeller: data.isSeller || false, // Provide a default value of false if undefined
  });
};

const register = (data) => {
  return new Promise((resolve, reject) => {
    Loading.show();
    createUserWithEmailAndPassword(auth, data.email, data.password)
      .then((userCredential) => {
        updateProfile(userCredential.user, {
          displayName: data.firstName + ' ' + data.lastName,
        }).then(() => {
          addUser(userCredential.user, data);
        });

        console.log('added user');
        console.log(userCredential);

        Loading.hide();
        resolve(userCredential.user);
      })
      .catch((error) => {
        Loading.hide();
        Notify.create({
          message: error.message,
          color: 'negative',
        });
        reject(error.message);
      });
  });
};

export default register;
