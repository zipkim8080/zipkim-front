<script setup>
import { ref, computed } from 'vue';
import loginPage from '@/pages/auth/LoginPage.vue';
import { useStore } from 'vuex';

const loginModal = ref(false);
const loginModalOpen = () => {
  loginModal.value = !loginModal.value;
};
const store = useStore();

const accessToken = computed(() => store.state.accessToken);

console.log('현재 토큰 : ', accessToken.value);
</script>

<template>
  <div class="login-overlay">
    <button class="btn btn-lg btn-secondary" @click="loginModalOpen">
      <i class="fa-solid fa-user"></i>
    </button>
    <transition name="fade">
      <div class="modal-wrap" v-show="loginModal">
        <div class="modal-container">
          <template v-if="!accessToken">
            <loginPage @close="loginModalOpen" />
          </template>
          <template> </template>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.fade-enter-active {
  transition: all 0.5s;
}

.fade-enter-from {
  opacity: 0;
}

.fade-enter-to {
  opacity: 1;
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

.login-overlay {
  position: absolute;
  right: 2%;
  top: 3%;
  z-index: 10; /* 지도보다 높은 값을 설정 */
}
</style>
