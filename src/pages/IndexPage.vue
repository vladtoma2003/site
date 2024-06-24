<template>
  <q-page class="flex flex-center">
    <q-list>
      <q-item v-for="user in users" :key="user.id">
        <q-item-section>
          <q-item-label>{{ user.username }}</q-item-label>
          <q-item-label caption>{{ user.email }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </q-page>
</template>

<script setup lang="ts">
import { defineOptions, onMounted, ref } from 'vue';
import { DocumentData, collection, onSnapshot } from 'firebase/firestore';
import { db } from 'src/firebase';

const users = ref<DocumentData>([]);

/**
 * Fetch all users from Firestore
 */
onMounted(async () => {
  onSnapshot(collection(db, 'users'), (snapshot) => {
    let usersArray: DocumentData[] = [];
    snapshot.forEach((doc) => {
      const user = {
        id: doc.id,
        username: doc.data().username,
        email: doc.data().email,
        password: doc.data().password,
      };
      usersArray.push(user);
    });
    users.value = usersArray;
  });
});

defineOptions({
  name: 'IndexPage',
});
</script>
