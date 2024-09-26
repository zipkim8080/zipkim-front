<template>
  <!-- XX동 매물 보기 버튼 -->
  <div class="xxDong-overlay">
    <button
      class="btn kb_btn2 btn-lg me-2"
      @click="xxDongClick"
      :class="{ visited: isClicked }"
    >
      <!-- {{ dong }} -->
      XX동 전세가율 확인
    </button>
  </div>
</template>
<script setup>
import { ref } from 'vue';
import { useKakaoMapStore } from '@/stores/KakaoMapStore';

const kakaoMapStore = useKakaoMapStore();
const isClicked = ref(false); // 클릭 여부 상태 저장

function xxDongClick() {
  kakaoMapStore.xxDongEvent();
  isClicked.value = true;
}
</script>

<style>
.xxDong-overlay {
  position: absolute;
  bottom: 2%;
  right: 46%;
  z-index: 9;
}
.kb_btn2 {
  background-color: #f3b706;
  border: none;
  color: white;
}
.kb_btn2:hover {
  background-color: #f2d383;
  color: white;
}
.kb_btn2.visited {
  background-color: #f3b706 !important;
  border: none !important;
  color: white !important;
}
.kb_btn2.visited:hover {
  background-color: #f2d383 !important;
  color: white !important;
}
</style>
