<template>
  <div>
    <h1>Register</h1>
    <q-form @submit.prevent="submitReg">
      <q-card-section>
        <q-input v-model="register.username" label="Username"></q-input>
        <q-input v-model="register.email" label="Email"></q-input>
        <q-input
          v-model="register.password"
          label="Password"
          type="password"
        ></q-input>
        <br />
        <q-btn
          class="full-width"
          label="Register"
          type="submit"
          color="primary"
        ></q-btn>

        <div class="text-center q-mt-sm q-gutter-sm">
          <router-link class="q-mr-sm" to="/LoginPage"
            >Already have an account?</router-link
          >
        </div>
      </q-card-section>
    </q-form>
  </div>
</template>

<script>
import { addDoc, collection, getDocs } from 'firebase/firestore';
import { db } from 'src/firebase';
export default {
  data() {
    return {
      register: {
        username: '',
        email: '',
        password: '',
      },
    };
  },
  methods: {
    async addUser(user) {
      try {
        await addDoc(collection(db, 'users'), {
          username: user.username,
          email: user.email,
          password: user.password,
        });
      } catch (e) {
        console.error('Error adding document: ', e);
      }
    },
    async getUsers() {
      let usersArray = [];
      console.log('getting users');
      const querySnapshot = await getDocs(collection(db, 'users'));
      querySnapshot.forEach((doc) => {
        const user = {
          id: doc.id,
          username: doc.data().username,
          email: doc.data().email,
          password: doc.data().password,
        };
        usersArray.push(user);
      });
      return usersArray;
    },
    async checkExistance(email) {
      const users = await this.getUsers();
      users.forEach((user) => {
        if (user.email === email) {
          console.log(user);
          return true;
        }
      });
      return false;
    },
    submitReg() {
      if (
        !this.register.username ||
        !this.register.email ||
        !this.register.password
      ) {
        this.$q.notify({
          message: 'Please fill in all fields',
          color: 'negative',
        });
      } else if (this.register.password.length < 8) {
        this.$q.notify({
          message: 'Password must be at least 8 characters long',
          color: 'negative',
        });
      } else if (this.register.email.includes('@') === false) {
        this.$q.notify({
          message: 'Please enter a valid email',
          color: 'negative',
        });
        // } else if (this.checkExistance(this.register.email)) {
        //   this.$q.notify({
        //     message: 'Email already exists',
        //     color: 'negative',
        //   });
      } else {
        const user = {
          username: this.register.username,
          email: this.register.email,
          password: this.register.password,
        };
        // send to firebase
        this.addUser(user);
        console.log(user);
        this.$q.notify({
          message: 'Registration successful',
          color: 'positive',
        });
      }
    },
  },
};
</script>

<style scoped>
div {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
