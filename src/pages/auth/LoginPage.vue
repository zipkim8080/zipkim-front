<script setup>
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import { defineEmits } from 'vue';
import infoPage from '@/pages/auth/InfoPage.vue';
import axios from 'axios';

const isAuthenticated = ref(false);
const emit = defineEmits(['close']);
const infoModal = ref(false);

const infoModalOpen = () => {
  infoModal.value = !infoModal.value;
};

const naverLogin = () => {
  window.location.href = 'http://localhost:8080/oauth2/authorization/naver';
};
const googleLogin = () => {
  window.location.href = 'http://localhost:8080/oauth2/authorization/google';
};
const kakaoLogin = async () => {
  window.location.href = 'http://localhost:8080/oauth2/authorization/kakao';
};

const store = useStore();

const checkStatus = async () => {
  try {
    const response = await axios.get('http://localhost:8080/kakao/login');
    const accessToken = response.data;

    if(accessToken) {
      isAuthenticated.value=true;
      console.log('로그인 완료');
      saveAccessToken(accessToken);
    } else {
      isAuthenticated.value=false;
      console.log('로그인 실패');
    }
  }catch (error) {
    console.error('로그인 중 오류')
    isAuthenticated.value=false;
  }
};
onMounted(()=>{
  checkStatus();
});
const saveAccessToken = (token) => {
  store.dispatch('updateAccessToken', token);
};
</script>

<template>
  <div class="title-box">
    <div class="title">
      <h1 class="login-title">로그인</h1>
      <button class="close-btn" @click="$emit('close')">
        <i class="fa-solid fa-x"></i>
      </button>
    </div>
    <p class="text">로그인 하면 모든 서비스를 이용할 수 있어요!</p>
  </div>

  <div class="container">
    <button @click="naverLogin" class="login-btn">
      <img src="@/assets/images/naver_login.png" alt="" />
    </button>

    <button @click="googleLogin" class="login-btn">
      <img src="@/assets/images/google_login.png" alt="" />
    </button>

    <button @click="kakaoLogin" class="login-btn">
      <img src="@/assets/images/kakao_login.png" alt="" />
    </button>
  </div>

  <a @click="infoModalOpen" href="#">
    <p class="info">개인정보 처리방침</p>
    <div class="modal-wrap" v-show="infoModal">
      <div class="modal-container">
        <infoPage @close="infoModalOpen" />
      </div>
    </div>
  </a>
</template>

<style scoped>
.title {
  display: flex;
  justify-content: space-between;
  margin: 0;
}

.login-title {
  flex: 1;
  text-align: center;
  margin: 0;
  padding-left: 30px;
}

a {
  color: black;
}

.close-btn {
  border: none;
  background: none;
  margin-right: 10px;
  padding: 0px;
}

.text {
  text-align: center;
  margin: 20px 0px;
}
.info {
  text-align: center;
  margin: 20px 0px;
}

.container {
  display: flex;
  flex-direction: column;
  gap: 15px;
  align-items: center;
  padding-top: 10px;
}

.login-btn {
  border: none;
  background: none;
  padding: 0;
  outline: none;
}
.login-btn img {
  width: 180px;
  height: auto;
}

.modal-wrap {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 2000;
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
  z-index: 2000;
}
</style>
