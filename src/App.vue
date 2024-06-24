<template>
  <router-view />
</template>

<script setup lang="ts">
import { defineOptions } from 'vue';
// import { useUsers } from 'src/functions';
// import { onMounted, ref } from 'vue';
// import { DocumentData } from 'firebase/firestore';

defineOptions({
  name: 'App',
  mounted() {
    this.$q.dark.set(true);
  },
});

// const users = ref<DocumentData>([]);

// onMounted(() => {
//   const ret = useUsers();
//   const get = ret.getUsers;
//   const users = get();
//   console.log(users);
// });
// const users = ref<DocumentData>([]);

/**
 * Fetch all users from Firestore
 */
// onMounted(async () => {
//   console.log('Fetching users...');
//   const querySnapshot = await getDocs(collection(db, 'users'));
//   let usersArray: DocumentData[] = [];

//   querySnapshot.forEach((doc) => {
//     const user = {
//       id: doc.id,
//       username: doc.data().username,
//       email: doc.data().email,
//       password: doc.data().password,
//     };
//     usersArray.push(user);
//   });
//   users.value = usersArray;
// });
// console.log(users);
</script>
