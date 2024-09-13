<script setup>
// import { useRouter } from 'vue-router';
import { ref } from 'vue';
import { defineEmits } from 'vue';

const emit = defineEmits(['close']);

// const router = useRouter();
// const toLogin = () => {
//   router.push({ name: 'login' });
// };
</script>

<template>
  <div class="title">
    <h1 class="login-title">개인정보 야미~</h1>
    <!-- <button class="close-btn" @click="$emit('close')"><</button> -->
  </div>
</template>

<style scoped>
.title {
  display: flex;
  justify-content: space-between;
  margin: 10px 0px;
}

.login-title {
  flex: 1;
  text-align: center;
  margin: 0;
  padding-left: 30px;
}

.close-btn {
  border: none;
  background: none;
  margin-right: 20px;
  padding: 0px;
}
</style>
