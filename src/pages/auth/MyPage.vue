<script setup>
import { ref, onMounted, defineEmits } from 'vue';
import { useLoginStore } from '@/stores/LoginStore';
import SMS from '@/pages/auth/SMS.vue';
import Broker from '@/pages/auth/Broker.vue';
import axios from '@/api/index';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

const loginStore = useLoginStore();
const phoneNumber = ref(null);
const brokerNumber = ref(null);
const role = ref(null);
const showBrokerModal = ref(false);

const getPhoneNumber = async () => {
  try {
    const response = await axios.get('https://zipkimserver.store/api/users/phone');
    phoneNumber.value = response.data.phoneNumber;
    brokerNumber.value = response.data.brokerNumber;
  } catch (error) {
    console.log('오루 발생: ', error);
  }
};

const getRole = async () => {
  try {
    const response = await axios.get('https://zipkimserver.store/api/role');
    role.value = response.data;
    console.log(role.value);
  } catch (error) {
    console.log('오류발생: ', error);
  }
};

const openBrokerModal = () => {
  showBrokerModal.value = true;
};
const closeBrokerModal = () => {
  showBrokerModal.value = false;
  getPhoneNumber();
  getRole();
};

// 로그아웃 함수
const handleLogout = () => {
  loginStore.logout();
  window.location.reload();
};

onMounted(() => {
  getPhoneNumber();
  getRole();
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
    <!-- 휴대폰 번호가 있으면 번호를 표시 -->
    <div v-if="phoneNumber" class="profile-item">
      <div class="key">휴대폰번호</div>
      <div class="value">
        <div>{{ phoneNumber }}</div>
      </div>
    </div>

    <!-- 중개사 번호 인증 -->
    <div class="profile-item">
      <div class="key">중개사번호</div>
      <div class="value">
        <div v-if="!brokerNumber">
          <button class="certify-button" @click="openBrokerModal">중개자격번호 인증</button>
        </div>

        <!-- 중개사 번호가 있으면 중개사 번호 표시 -->
        <div v-else>{{ brokerNumber }}</div>
      </div>
    </div>

    <!-- 로그아웃 버튼 -->
    <button class="logout-button" @click="handleLogout">로그아웃</button>

    <!-- 중개사 인증 모달 -->
    <transition name="fade">
      <div v-if="showBrokerModal" class="sms-modal">
        <Broker @close="closeBrokerModal" @updateRole="getRole" />
      </div>
    </transition>
  </div>
</template>

<style scoped>
.profile-container {
  padding: 0px 20px 20px 20px;
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
