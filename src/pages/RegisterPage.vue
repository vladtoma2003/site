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
    submitReg() {
      // TODO: Check if unique when database done
      // TODO: Register and automatically log in user
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
      } else {
        this.$q.notify({
          message: 'Registration successful',
          color: 'positive',
        });
        // this.registerUser();
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
