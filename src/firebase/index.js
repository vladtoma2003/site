import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { LocalStorage } from 'quasar';

const firebaseConfig = {
  apiKey: 'AIzaSyAe8RFK_HyZA_H9D23pl0E-f8rUugJt-NE',
  authDomain: 'genericsite-dfd0c.firebaseapp.com',
  projectId: 'genericsite-dfd0c',
  storageBucket: 'genericsite-dfd0c.appspot.com',
  messagingSenderId: '541935331057',
  appId: '1:541935331057:web:79ff9c8f1de1ac60b2eb50',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, app };
export const auth = getAuth(app);

onAuthStateChanged(auth, (user) => {
  if (user) {
    LocalStorage.set('user', user);
    console.log('User is signed in');
    console.log(user);
  } else {
    LocalStorage.remove('user');
    console.log('User is signed out');
  }
});
