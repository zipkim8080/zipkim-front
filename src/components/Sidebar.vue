<script setup>
import { ref } from 'vue';
import bookmark from '@/pages/auth/Bookmark.vue';
import forSale from '@/pages/auth/ForSale.vue';
import recent from '@/pages/auth/Recent.vue';
import sms from '@/pages/auth/SMS.vue';

const emits = defineEmits(['close']);

const bookmarkModal = ref(false);
const recentModal = ref(false);
const forSaleModal = ref(false);
const smsModal = ref(false);

const bookmarkModalOpen = () => {
  bookmarkModal.value = !bookmarkModal.value;
};
const recentModalOpen = () => {
  recentModal.value = !recentModal.value;
};
const forSaleModalOpen = () => {
  forSaleModal.value = !forSaleModal.value;
};
const smsModalOpen = () => {
  smsModal.value = !smsModal.value;
};
</script>

<template>
  <div class="modal-sidebar">
    <div class="title">
      <h1>마이 페이지</h1>
      <button class="close-btn" @click="$emit('close')">
        <i class="fa-solid fa-x"></i>
      </button>
    </div>

    <div class="menu">
      <!-- 각 메뉴 항목들 -->
      <button @click="bookmarkModalOpen" class="menu-item">
        <span class="text">즐겨찾기</span>
        <div class="modal-wrap" v-show="bookmarkModal">
          <div class="modal-container" @click.stop>
            <bookmark @close="bookmarkModalOpen" />
          </div>
        </div>
      </button>

      <button @click="recentModalOpen" class="menu-item">
        <span class="text">최근 본 매물</span>
        <div class="modal-wrap" v-if="recentModal">
          <div class="modal-container" @click.stop>
            <recent @close="recentModalOpen" />
          </div>
        </div>
      </button>

      <button @click="forSaleModalOpen" class="menu-item">
        <span class="text">등록한 매물</span>
        <div class="modal-wrap" v-if="forSaleModal">
          <div class="modal-container" @click.stop>
            <forSale @close="forSaleModalOpen" />
          </div>
        </div>
      </button>

      <button @click="smsModalOpen" class="menu-item">
        <span class="text">휴대폰 본인인증</span>
        <div class="modal-wrap" v-if="smsModal">
          <div class="modal-container" @click.stop>
            <sms @close="smsModalOpen" />
          </div>
        </div>
      </button>
    </div>
  </div>
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
}

.menu {
  display: flex;
  flex-direction: column; /* 세로 정렬 */
  gap: 10px;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 15px;
  border-radius: 5px;
  text-decoration: none;
  color: #333;
  transition: background-color 0.3s ease, color 0.3s ease;
}

/* 마우스를 올렸을 때 색상 변경 */
.menu-item:hover {
  background-color: #e0e0e0; /* 배경색 변경 */
  color: #007bff; /* 글자색 변경 */
}

.text {
  font-size: 18px; /* 텍스트 크기 조정 */
  margin-left: 10px;
}

.modal-wrap {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0);
  z-index: 20;
}

.modal-container {
  position: fixed;
  top: 50%;
  right: 0px;
  transform: translateY(-50%);
  width: 350px;
  height: 828px;
  background: #fff;
  border-radius: 10px;
  padding: 20px;
  box-sizing: border-box;
  z-index: 20;
}
</style>
