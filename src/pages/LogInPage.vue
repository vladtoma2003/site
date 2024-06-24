<template>
  <div>
    <h1>Login</h1>
    <q-form @submit.prevent="submitForm">
      <q-card-section>
        <q-input label="Username" v-model="login.username"></q-input>
        <q-input
          label="Password"
          type="password"
          v-model="login.password"
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

<script>
export default {
  data() {
    return {
      login: {
        username: '',
        password: '',
      },
    };
  },
  methods: {
    submitForm() {
      // TODO: Log in user when backend is ready
      if (!this.login.username || !this.login.password) {
        this.$q.notify({
          message: 'Please fill in all fields',
          color: 'negative',
        });
      } else if (this.login.password.length < 8) {
        this.$q.notify({
          message: 'Password must be at least 8 characters long',
          color: 'negative',
        });
      } else {
        this.$q.notify({
          message: 'Login successful',
          color: 'positive',
        });
        // this.loginUser();
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
