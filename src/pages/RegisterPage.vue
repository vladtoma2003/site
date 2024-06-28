<template>
  <div>
    <h1>Register</h1>
    <q-form ref="form" @submit="submitReg">
      <q-card-section>
        <q-input v-model="user.firstName" label="First Name"></q-input>
        <q-input v-model="user.lastName" label="Last Name"></q-input>
        <q-input v-model="user.email" label="Email"></q-input>
        <q-input
          v-model="user.password"
          label="Password"
          type="password"
        ></q-input>
        <q-checkbox
          v-model="user.isBuyer"
          @update:model-value="updateCheckbox('isBuyer')"
          label="I'm Buying"
        ></q-checkbox>
        <q-checkbox
          v-model="user.isSeller"
          @update:model-value="updateCheckbox('isSeller')"
          label="I'm Selling"
        ></q-checkbox>
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

<script setup>
import { ref, reactive } from 'vue';
import register from 'src/firebase/firebase-register';
import { useRouter } from 'vue-router';

const user = reactive({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  isBuyer: true,
  isSeller: false,
});

const form = ref(null);
const router = useRouter();

const submitReg = async () => {
  console.log(user);
  console.log(form.value);
  console.log(form.value.validate());

  if (form.value && form.value.validate() && !!(await register(user))) {
    console.log('User registered successfully');
    router.push('/HomePage');
  }
};

function updateCheckbox(role) {
  if (role === 'isBuyer') {
    user.isBuyer = true;
    user.isSeller = false; // Ensure only one checkbox can be checked
  } else if (role === 'isSeller') {
    user.isSeller = true;
    user.isBuyer = false; // Ensure only one checkbox can be checked
  }
  console.log(role);
  console.log(user);
}
</script>

<style scoped></style>
<!-- .checkbox-container {
  display: flex;
  justify-content: space-between; /* Adjust this as needed */
} -->
<!-- div {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
} -->
