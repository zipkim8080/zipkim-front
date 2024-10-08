<script setup>
import { defineEmits } from 'vue';
import axios from 'axios';
import { useLoginStore } from '@/stores/LoginStore.js';

const emit = defineEmits(['close']);

const LoginStore = useLoginStore();
const un = LoginStore.loadUsernameFromToken();

const test = async () => {
  try {
    const response = await axios.post('/api/addDB', {
      username: un,
      phonenumber: '333',
    });
  } catch (error) {
    console.log('에러');
  }
};
const handleClose = () => {
  emit('close');
};
</script>

<template>
  <div class="title">
    <h1>내가 등록한 매물</h1>

    <!-- <button class="close-btn" @click="handleClose">
      <i class="fa-solid fa-x"></i>
    </button> -->
  </div>
  <div></div>
</template>

<style scoped>
.title {
  display: flex;
  justify-content: space-between;
  margin: 0;
}

.close-btn {
  border: none;
  background: none;
  margin-right: 10px;
  padding: 0px;
  cursor: pointer; /* 커서가 클릭 가능한 상태임을 표시 */
}

.close-btn i {
  font-size: 20px; /* 아이콘 크기 조정 */
}
</style>
