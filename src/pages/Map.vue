<script setup>
import { useRouter } from 'vue-router';
import KakaoMap from '../components/tool/KaKaoMap.vue';
const router = useRouter();
// 단순 페이지 이동 //
const regi = () => {
  router.push({
    path: '/add',
  });
};
</script>
<template>
  <h1>Map이 메인</h1>
  <input
    class="float float-end btn btn-primary"
    type="button"
    value="매물 등록"
    @click="regi()"
  />
  <KakaoMap />
</template>
