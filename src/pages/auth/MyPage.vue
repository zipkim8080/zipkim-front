<script setup>
import { ref, onMounted, defineEmits } from 'vue';
import { useLoginStore } from '@/stores/LoginStore';
import SMS from '@/pages/auth/SMS.vue';
import axios from '@/api/index';

const loginStore = useLoginStore();
const phoneNumber = ref(null);
const showSMSModal = ref(false);

const getPhoneNumber = async () => {
  try {
    const response = await axios.get('/api/users/phone');
    phoneNumber.value = response.data;
  } catch (error) {
    console.log('오루 발생: ', error);
  }
};

const openSMSModal = () => {
  showSMSModal.value = true;
};

const closeSMSModal = () => {
  showSMSModal.value = false;
};

// 로그아웃 함수
const handleLogout = async () => {
  try {
    const response = await axios.post('/api/logout');
    if (response.status === 200) {
      loginStore.logout();
      window.location.reload(); // 로그아웃 시 새로고침으로 메인화면
    } else {
      alert('실패');
    }
  } catch (error) {
    console.log('로그아웃 에러: ', error);
  }
};

onMounted(() => {
  getPhoneNumber();
});
</script>

<template>
  <div class="profile-container">
    <!-- 닉네임 -->
    <div class="profile-item">
      <div class="key">이름</div>
      <div class="value">{{ loginStore.name }}</div>
    </div>

    <!-- 이메일 -->
    <div class="profile-item">
      <div class="key">이메일</div>
      <div class="value">{{ loginStore.email }}</div>
    </div>

    <!-- 휴대폰 인증 -->
    <div class="profile-item">
      <div class="key">휴대폰번호</div>
      <div class="value">
        <div v-if="!phoneNumber">
          <button class="certify-button" @click="openSMSModal">휴대폰 본인인증</button>
        </div>
        <!-- 휴대폰 번호가 있으면 번호를 표시 -->
        <div v-else>{{ phoneNumber }}</div>
      </div>
    </div>

    <!-- 로그아웃 버튼 -->
    <button class="logout-button" @click="handleLogout">로그아웃</button>

    <!-- SMS 인증 모달 -->
    <transition name="fade">
      <div v-if="showSMSModal" class="sms-modal">
        <SMS @close="closeSMSModal" @updatePhoneNumber="getPhoneNumber" />
      </div>
    </transition>
  </div>
</template>

<style scoped>
.profile-container {
  padding: 20px;
  font-size: 16px;
}

.profile-item {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #e0e0e0;
  height: 70px;
}

.key,
.value {
  font-size: 18px;
  display: flex;
  align-items: center;
}

.certify-button {
  color: #007bff;
  border: none;
  background: none;
  cursor: pointer;
}

.logout-button {
  margin-top: 20px;
  background: #fff;
  border: 1px solid black;

  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  width: 100%;
}

.sms-modal {
  position: fixed;
  top: 30%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 380px;

  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
}
</style>
