<template>
  <div>
    <h1>Login</h1>
    <q-form ref="form" @submit="submitLog">
      <q-card-section>
        <q-input label="Email" v-model="user.email"></q-input>
        <q-input
          label="Password"
          type="password"
          v-model="user.password"
        ></q-input>
        <br />
        <q-btn
          class="full-width"
          label="Login"
          type="submit"
          color="primary"
        ></q-btn>
        <div class="text-center q-mt-sm q-gutter-sm">
          <router-link class="q-mr-sm" to="/RegisterPage"
            >Don't have an account?</router-link
          >
        </div>
      </q-card-section>
    </q-form>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import login from 'src/firebase/firebase-login';
import { useRouter } from 'vue-router';

const user = reactive({
  email: '',
  password: '',
});

const form = ref(null);
const router = useRouter();

const submitLog = async () => {
  console.log(user);

  if (form.value && form.value.validate()) {
    try {
      await login(user);
      router.push('/HomePage');
    } catch (error) {
      console.error(error);
    }
  }
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
