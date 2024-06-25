<template>
  <div>
    <h1>User Profile</h1>
    <q-card>
      <q-card-section>
        <q-input
          label="First Name"
          v-model="user.firstName"
          :readonly="!isEditing.value"
        ></q-input>
        <q-input
          label="Last Name"
          v-model="user.lastName"
          :readonly="!isEditing.value"
        ></q-input>
        <q-input
          label="Email"
          v-model="user.email"
          :readonly="!isEditing.value"
        ></q-input>
      </q-card-section>
      <q-card-section>
        <q-btn
          class="full-width"
          label="Edit Profile"
          color="primary"
          v-if="!isEditing.value"
          @click="editUser"
        ></q-btn>
        <q-btn
          class="full-width"
          label="Save changes"
          color="primary"
          v-if="isEditing.value"
          @click="saveChanges"
        ></q-btn>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { db } from 'src/firebase/index.js';
import { onMounted } from 'vue';
import { getDoc, doc, setDoc } from 'firebase/firestore';
import { auth } from 'src/firebase/index.js';

interface User {
  firstName: string;
  lastName: string;
  email: string;
}
const user = ref<User>({ firstName: '', lastName: '', email: '' });

const isEditing = reactive({ value: false });

function editUser() {
  isEditing.value = true;
}

function saveChanges() {
  isEditing.value = false;
  updateUser();
}

// // modify the user parameters (name and email)
async function updateUser() {
  if (auth.currentUser) {
    const uid = auth.currentUser.uid;
    const userRef = doc(db, 'users', uid);
    const userDoc = {
      displayName: `${user.value.firstName} ${user.value.lastName}`,
      email: user.value.email,
    };
    await setDoc(userRef, userDoc, { merge: true });
  }
}

async function getUserData() {
  // get the current user from db using user.uid
  if (auth.currentUser) {
    const uid = auth.currentUser.uid;
    const docRef = await getDoc(doc(db, 'users', uid));

    if (docRef.exists()) {
      // split displayName into first and last name
      const displayName = docRef.data().displayName;
      const nameArray = displayName.split(' ');
      user.value.firstName = nameArray[0];
      user.value.lastName = nameArray[1];
      user.value.email = docRef.data().email;
    }
  }
}

onMounted(async () => {
  getUserData();
});
</script>
