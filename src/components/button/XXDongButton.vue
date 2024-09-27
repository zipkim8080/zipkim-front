<template>
  <!-- XX동 매물 보기 버튼 -->
  <div class="xxDong-overlay">
    <button class="kb_btn " @click="xxDongClick">
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
</style>
