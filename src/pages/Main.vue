<script setup>
import { onMounted, ref } from 'vue';
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

const router = useRouter();
const loginStore = useLoginStore();

//기본
const ocrData = ref(null);
const showModal = ref(false);
const startModal = ref(true);
const loginModal = ref(false);

// 단순 페이지 이동 //
const regi = () => {
  if (!loginStore.isAuthenticated()) {
    openLoginModal();
  } else {
    router.push({ name: 'AddProperty' });
  }
};

const dgCheck = () => {
  if (!loginStore.isAuthenticated()) {
    openLoginModal();
  } else {
    showModal.value = true;
  }
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
    <input class="kb_btn" type="button" value="매물 등록" @click="regi" />
  </div>
  <!-- 등기 확인 버튼 -->
  <div class="register-overlay2">
    <input class="kb_btn" type="button" value="등기 확인" @click="dgCheck" />
  </div>

  <transition name="fade">
    <div v-if="loginModal" class="modal-wrap">
      <div class="modal-container">
        <LoginPage @close="loginModal = false" />
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
</style>
