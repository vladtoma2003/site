import { auth } from './index.js';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Loading, Notify } from 'quasar';

const login = (data) => {
  Loading.show();
  return new Promise((resolve, reject) => {
    Loading.show();
    signInWithEmailAndPassword(auth, data.email, data.password)
      .then((userCredential) => {
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

export default login;
