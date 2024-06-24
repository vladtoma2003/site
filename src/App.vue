<template>
  <router-view />
</template>

<script setup lang="ts">
defineOptions({
  name: 'App',
  mounted() {
    this.$q.dark.set(true);
  },
});
</script>
