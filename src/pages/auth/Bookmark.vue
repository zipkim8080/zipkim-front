<script setup>
import { defineEmits } from 'vue';

const emit = defineEmits(['close']);

const handleClose = () => {
  emit('close');
};
</script>

<template>
  <div class="title">
    <h1>즐겨찾기</h1>
    <button class="close-btn" @click="handleClose">
      <i class="fa-solid fa-x"></i>
    </button>
  </div>
</template>

<style scoped>
.title {
  display: flex;
  justify-content: space-between;
}

.close-btn {
  border: none;
  background: none;
  margin-right: 20px;
  padding: 0px;
}
</style>
