<script setup>
import { ref } from 'vue';
import Sidebar from '@/components/Sidebar.vue';

const sideModal = ref(false);
const sideModalOpen = () => {
  sideModal.value = !sideModal.value;
};
</script>

<template>
  <div class="login-overlay">
    <button class="btn btn-lg btn-secondary" @click="sideModalOpen">
      <i class="fa-solid fa-info"></i>
    </button>
    <transition name="fade">
      <div class="modal-wrap" v-show="sideModal">
        <div class="modal-container">
          <Sidebar @close="sideModalOpen" />
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
  background: rgba(0, 0, 0, 0);
  z-index: 10;
}

.modal-container {
  position: fixed;
  top: 53%;
  right: 15px;
  transform: translateY(-50%);
  width: 350px;
  height: 830px;
  background: #fff;
  border-radius: 10px;
  padding: 20px;
  box-sizing: border-box;
  z-index: 10;
}

.login-overlay {
  position: absolute;
  right: 2%;
  top: 8%;
  z-index: 10; /* 지도보다 높은 값을 설정 */
}
</style>
