<template>
  <!-- XX동 매물 보기 버튼 -->
  <div class="xxDong-overlay">
    <input
      class="btn btn-secondary btn-lg"
      type="button"
      value="XX동 전세가율 확인"
      @click="xxDongClick"
    />
  </div>
</template>
<script setup>
import { ref } from 'vue';
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
  z-index: 10; /* 지도보다 높은 값을 설정 */
}
</style>
