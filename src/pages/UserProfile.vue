<template>
  <div>
    <h1>User Profile</h1>
    <p>Name: {{ user.name }}</p>
    <p>Email: {{ user.email }}</p>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

export default {
  setup() {
    const user = ref(null);

    onMounted(async () => {
      const auth = getAuth();
      onAuthStateChanged(auth, async (userAuth) => {
        if (userAuth) {
          // Assuming user data is stored in a collection named 'users' with document ID equal to user UID
          const db = getFirestore();
          const userDoc = doc(db, 'users', userAuth.uid);
          const userSnapshot = await getDoc(userDoc);
          if (userSnapshot.exists()) {
            user.value = userSnapshot.data();
          } else {
            console.log('No such document!');
          }
        } else {
          console.log('No user logged in');
        }
      });
    });

    return { user };
  },
};
</script>
