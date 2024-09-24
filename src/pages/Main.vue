<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import LoginButton from '../components/button/LoginButton.vue';
import TestButton from '../components/button/TestButton.vue';
import SearchFilter from '../pages/side/SearchFilter.vue';
import KakaoMap from '../components/tool/KaKaoMap.vue';
import XXDongButton from '../components/button/xxDongButton.vue';

const router = useRouter();
// 단순 페이지 이동 //
const regi = () => {
  router.push({
    path: '/add',
  });
};
</script>
<template>
  <div class="search-overlay">
    <SearchFilter />
  </div>
  <div>
    <LoginButton />
    <TestButton />
  </div>
  <XXDongButton />
  <!-- 매물 등록 버튼 -->
  <div class="register-overlay">
    <input class="btn btn-success btn-lg" type="button" value="매물 등록" @click="regi()" />
  </div>
  <KakaoMap class="kakao-map" />
</template>

<style scoped>
.register-overlay {
  position: absolute;
  bottom: 2%;
  right: 1%;
  z-index: 10;
}
</style>
