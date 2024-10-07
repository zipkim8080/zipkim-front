<script setup>
import { ref, onMounted } from 'vue';
import { useLoginStore } from '@/stores/LoginStore';
import sidebar from '@/components/Sidebar.vue';
import loginPage from '@/pages/auth/LoginPage.vue';

const loginStore = useLoginStore();

const loginModal = ref(false);
const sidebarModal = ref(false);

const loginModalOpen = () => {
  loginModal.value = !loginModal.value;
};
const sidebarModalOpen = () => {
  sidebarModal.value = !sidebarModal.value;
};

onMounted(() => {
  loginStore.loadTokenFromCookies();
});
</script>

<template>
  <div class="login-overlay">
    <!-- 로그인 상태에 따라 다른 컴포넌트를 렌더링 -->
    <template v-if="!loginStore.isAuthenticated()">
      <button class="btn btn-lg btn-secondary when-logout" @click="loginModalOpen">
        <i class="fa-solid fa-user"></i>
      </button>
      <transition name="fade">
        <!-- 모달의 바깥을 클릭하면 닫히도록 @click.self 사용 -->
        <div class="modal-wrap" v-show="loginModal" @click.self="loginModalOpen">
          <div class="modal-container">
            <loginPage @close="loginModalOpen" />
          </div>
        </div>
      </transition>
    </template>

    <!-- 로그인 상태일 때 Sidebar를 보여줌 -->
    <template v-else>
      <button class="btn btn-lg btn-secondary when-login" @click="sidebarModalOpen">
        <i class="fa-solid fa-user"></i>
      </button>
      <transition name="fade">
        <!-- 모달의 바깥을 클릭하면 닫히도록 @click.self 사용 -->
        <div class="modal-wrap-mypage" v-show="sidebarModal" @click.self="sidebarModalOpen">
          <!-- <div class="modal-container-mypage"> -->
          <sidebar @close="sidebarModalOpen" />
          <!-- </div> -->
        </div>
      </transition>
    </template>
  </div>
</template>

<style scoped>
.btn {
  border: 0px;
}

.when-login {
  background-color: #f3b706;
}

.when-login:hover {
  background-color: #f2d383;
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

.modal-wrap {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  z-index: 10;
}

.modal-wrap-mypage {
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

/* .modal-container-mypage {
  position: fixed;
  top: 53%;
  right: 15px;
  transform: translate(-2.5%, -55%);
  width: 450px;
  height: 80%;
  background: #fff;
  border-radius: 10px;
  box-sizing: border-box;
  overflow-y: auto;
  z-index: 10;
} */

.login-overlay {
  position: absolute;
  right: 1%;
  top: 2%;
  z-index: 10;
}
</style>
