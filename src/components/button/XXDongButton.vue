<template>
  <!-- XX동 매물 보기 버튼 -->
  <KakaoMap ref="kakaoMapRef" />
  <div class="xxDong-overlay">
    <input
      class="btn btn-secondary btn-lg"
      type="button"
      value="XX동 전세가율 확인"
      @click="handleClick"
    />
  </div>
</template>
<script setup>
import { ref, watch } from 'vue';

import KakaoMap from '@/components/tool/KakaoMap.vue';
const kakaoMapRef = ref(null);

watch(kakaoMapRef, (newValue) => {
  if (newValue) {
    console.log('KakaoMap is ready.');
  }
});

function handleClick() {
  if (!kakaoMapRef.value) {
    console.error('KakaoMap component is not ready yet.');
    return;
  }
  kakaoMapRef.value.xxDongEvent();
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
