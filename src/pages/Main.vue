<script setup>
import { onMounted, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useLoginStore } from '@/stores/LoginStore';
import LoginButton from '../components/button/LoginButton.vue';
import SearchFilter from '../pages/side/SearchFilter.vue';
import KakaoMap from '../components/tool/KaKaoMap.vue';
import XXDongButton from '../components/button/xxDongButton.vue';
import CheckMyDoc from '@/pages/side/CheckMyDoc.vue';
import MyDocResultPage from '@/pages/side/MyDocResultPage.vue';
import Timer from '@/pages/auth/Timer.vue';
import PriceToggle from '../components/button/PriceToggle.vue';
import StartInfoPage from '@/pages/side/StartInfoPage.vue';
import AddProperty from './AddProperty.vue';
import LoginPage from '@/pages/auth/LoginPage.vue';
import Sidebar from '@/components/Sidebar.vue';
import axios from '@/api/index';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

const router = useRouter();
const loginStore = useLoginStore();

//기본
const ocrData = ref(null);
const showModal = ref(false);
const startModal = ref(true);
const loginModal = ref(false);
const sidebarModal = ref(false);
const role = computed(() => loginStore.role);

const getRole = async () => {
  try {
    const response = await axios.get('/api/role');
    role.value = response.data;
  } catch (error) {
    console.log('오루발생: ', error);
  }
};

// 단순 페이지 이동 //
const regi = () => {
  if (!loginStore.isAuthenticated()) {
    openLoginModal();
  } else {
    if (role.value !== 'ROLE_BROKER') {
      toast('중개자격번호를 인증해주세요.', {
        theme: 'auto', // 테마(auto, light, dark, colored)
        type: 'error', // 타입(info, success, warning, error, default)
        position: 'top-center', //토스트 생성위치
        pauseOnHover: false, //마우스오버시 멈춤 제거
        autoClose: 1000, //자동닫기
        hideProgressBar: true, //로딩바제거
      });
      openSidebarModal();
    } else {
      router.push({ name: 'AddProperty' });
    }
  }
};

const dgCheck = () => {
  if (!loginStore.isAuthenticated()) {
    openLoginModal();
  } else {
    showModal.value = true;
  }
};

const openSidebarModal = () => {
  sidebarModal.value = true;
};
const openLoginModal = () => {
  loginModal.value = true;
};
const closeStartModal = () => {
  startModal.value = false;
};
const handleOcrCompleted = (result) => {
  ocrData.value = result;
  showModal.value = false;
};
const showStartModal = () => {
  startModal.value = true;
};

onMounted(() => {
  loginStore.loadTokenFromCookies();
  getRole();
});
</script>
<template>
  <div class="search-overlay">
    <SearchFilter
      :startModal="startModal"
      :closeStartModal="closeStartModal"
      :showStartModal="showStartModal"
    />
  </div>
  <StartInfoPage v-if="startModal" />
  <Timer />
  <PriceToggle />
  <LoginButton />
  <XXDongButton />
  <!-- 매물 등록 버튼 -->
  <div class="register-overlay">
    <input
      v-if="role === 'ROLE_BROKER'"
      class="kb_btn"
      type="button"
      value="매물 등록"
      @click="regi"
    />
    <input v-else class="not-login" type="button" value="매물 등록" @click="regi" />
  </div>
  <!-- 등기 확인 버튼 -->
  <div class="register-overlay2">
    <input
      v-if="loginStore.isAuthenticated()"
      class="kb_btn"
      type="button"
      value="등기 확인"
      @click="dgCheck"
    />
    <input v-else class="not-login" type="button" value="등기 확인" @click="dgCheck" />
  </div>

  <transition name="fade">
    <div v-if="loginModal" class="modal-wrap">
      <div class="modal-container">
        <LoginPage @close="loginModal = false" />
      </div>
    </div>
  </transition>

  <transition name="fade">
    <div v-if="sidebarModal" class="side-modal-wrap" @click.self="sidebarModal = false">
      <div>
        <Sidebar class="sidebar" />
      </div>
    </div>
  </transition>
  <!-- 모달 백드롭 -->
  <div v-if="showModal" class="modal-backdrop" @click="showModal = false"></div>

  <!-- CheckMyDoc 모달 -->
  <transition name="fade">
    <CheckMyDoc v-if="showModal" @ocrCompleted="handleOcrCompleted" @close="showModal = false" />
  </transition>
  <!-- MyDocResultPage 모달 -->
  <MyDocResultPage v-if="ocrData" :ocrData="ocrData" @close="ocrData = null" />

  <KakaoMap class="kakao-map" />
</template>

<style scoped>
.register-overlay {
  position: absolute;
  bottom: 2%;
  right: 1%;
  z-index: 9;
}

.register-overlay2 {
  position: absolute;
  bottom: 2%;
  right: 1%;
  transform: translateX(-110%);
  z-index: 9;
}

.modal-backdrop {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 15;
}

.modal-wrap {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  z-index: 10;
}

.side-modal-wrap {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0);
  z-index: 10;
}

.modal-container {
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 320px;
  height: 400px;
  background: #fff;
  border-radius: 10px;
  padding: 20px;
  box-sizing: border-box;
  z-index: 1000;
}

.fade-enter-active {
  transition: all 0.5s;
}

.fade-enter-from {
  opacity: 0;
}

.fade-enter-to {
  opacity: 1;
}

.not-login {
  background-color: #6c757d;
  border: none;
  color: white;
  margin-right: 0.5rem !important;
  cursor: pointer;
  --bs-btn-padding-y: 0.5rem;
  --bs-btn-padding-x: 1rem;
  --bs-btn-font-size: 1.25rem;
  --bs-btn-border-radius: var(--bs-border-radius-lg);
  --bs-btn-font-weight: 400;
  --bs-btn-line-height: 1.5;
  --bs-btn-color: var(--bs-body-color);
  --bs-btn-bg: transparent;
  --bs-btn-border-width: var(--bs-border-width);
  --bs-btn-border-color: transparent;
  --bs-btn-hover-border-color: transparent;
  --bs-btn-box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.15), 0 1px 1px rgba(0, 0, 0, 0.075);
  --bs-btn-disabled-opacity: 0.65;
  --bs-btn-focus-box-shadow: 0 0 0 0.25rem rgba(var(--bs-btn-focus-shadow-rgb), 0.5);
  display: inline-block;
  padding: var(--bs-btn-padding-y) var(--bs-btn-padding-x);
  font-family: var(--bs-btn-font-family);
  font-size: var(--bs-btn-font-size);
  font-weight: var(--bs-btn-font-weight);
  line-height: var(--bs-btn-line-height);
  text-align: center;
  text-decoration: none;
  vertical-align: middle;
  user-select: none;
  border-radius: var(--bs-btn-border-radius);
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out,
    border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.not-login:hover {
  background-color: #5c636a;
  color: white;
}

.sidebar {
  position: absolute;
  top: 0%;
  right: 0%;
  transform: translate(-4%, 12.5%);
  width: 450px;
  height: 80vh;
  background: #fff;
  /* padding: 20px; */
  border-radius: 10px;
  border: 1px solid #aaa;
  overflow-y: auto;
  display: flex;
}
</style>
