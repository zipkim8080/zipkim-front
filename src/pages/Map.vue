<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import KakaoMap from '../components/tool/KaKaoMap.vue';
import loginPage from '@/pages/auth/LoginPage.vue';

const router = useRouter();
// 단순 페이지 이동 //
const regi = () => {
  router.push({
    path: '/add',
  });
};

const loginModal = ref(false);
const loginModalOpen = () => {
  loginModal.value = !loginModal.value;
};
</script>
<template>
  <h1>Map이 메인</h1>
  <input class="float float-end btn btn-primary" type="button" value="매물 등록" @click="regi()" />
  <button @click="loginModalOpen">로그인 이미지~</button>
  <div class="modal-wrap" v-show="loginModal">
    <div class="modal-container">
      <loginPage @close="loginModalOpen" />
    </div>
  </div>

  <KakaoMap />
</template>

<style scoped>
.modal-wrap {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  z-index: 1000;
}

.modal-container {
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 300px;
  height: 400px;
  background: #fff;
  border-radius: 10px;
  padding: 20px;
  box-sizing: border-box;
  z-index: 1000;
}
</style>
