<script setup>
import { defineEmits } from 'vue';

const emit = defineEmits(['close']);

const handleClose = () => {
  emit('close');
};
</script>

<template>
  <div class="title">
    <h1 class="login-title">개인정보 처리방침</h1>
    <button class="close-btn" @click="handleClose">
      <i class="fa-solid fa-x"></i>
    </button>
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
  padding-left: 3px;
}

.close-btn {
  border: none;
  background: none;
  margin-right: 0px;
  padding: 0px;
}
</style>
