<template>
  <!-- XX동 매물 보기 버튼 -->
  <div class="xxDong-overlay">
    <button class="btn btn-secondary btn-lg" @click="xxDongClick">
      <!-- {{ dong }} -->
      XX동 전세가율 확인
    </button>
  </div>
</template>
<script setup>
import { useKakaoMapStore } from '@/stores/KakaoMapStore';

const kakaoMapStore = useKakaoMapStore();

function xxDongClick() {
  kakaoMapStore.xxDongEvent();
}
</script>
<style>
.xxDong-overlay {
  position: absolute;
  bottom: 2%;
  right: 46%;
  z-index: 10;
}
</style>
