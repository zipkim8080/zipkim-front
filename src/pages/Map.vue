<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();
// 단순 페이지 이동 //
const regi = () => {
  router.push({
    path: '/regi',
  });
};
</script>

<template>
  <div class="container">
    <h1>Map이 메인</h1>
    <input
      class="float float-end btn btn-primary"
      type="button"
      value="매물 등록"
      @click="regi()"
    />
  </div>
</template>
