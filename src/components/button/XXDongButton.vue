<template>
  <!-- XX동 매물 보기 버튼 -->
  <div class="xxDong-overlay">
    <button class="kb_btn" @click="xxDongClick">
      {{ currentDong }} 매물 한눈에 보기
    </button>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue';
import { useKakaoMapStore } from '@/stores/KakaoMapStore';
import { useComplexesStore } from '@/stores/ComplexesStore';

const kakaoMapStore = useKakaoMapStore();
const complexesStore = useComplexesStore();
const isClicked = ref(false); // 클릭 여부 상태 저장
const currentDong = computed(() => complexesStore.dong);

function xxDongClick() {
  kakaoMapStore.xxDongEvent();
  isClicked.value = true;
  // complexesStore.clusterRemove();
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
