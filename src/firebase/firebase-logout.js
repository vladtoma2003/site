import { auth } from './index.js';
import { signOut } from 'firebase/auth';
import { Loading, Notify } from 'quasar';

const logout = () => {
  return new Promise((resolve, reject) => {
    Loading.show();

    signOut(auth)
      .then(() => {
        Loading.hide();
        resolve();
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

export default logout;
