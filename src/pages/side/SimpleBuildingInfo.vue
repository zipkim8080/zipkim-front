<script setup>
import PropertyList from '@/components/detail/propertyList.vue';
import { useRouter } from 'vue-router';
import { useKakaoMapStore } from '@/stores/KakaoMapStore';
import { useComplexesStore } from '@/stores/ComplexesStore';

const kakaoMapStore = useKakaoMapStore();
const complexesStore = useComplexesStore();
const router = useRouter();

function closeModal() {
  complexesStore.restoreState();
  kakaoMapStore.reposition(complexesStore.lat, complexesStore.lon);
  router.push({ name: 'Main' }); // 메인 페이지로 돌아가 모달 닫기
}
</script>

<template>
  <div class="cInfo-overlay">
    <div class="title-box">
      <div class="title">
        <h1 class="login-title">간략한 건물정보</h1>
        <button class="close-btn" @click="closeModal">
          <i class="fa-solid fa-x"></i>
        </button>
      </div>
    </div>
    <PropertyList />
  </div>
</template>

<style scope>
.cInfo-overlay {
  position: absolute;
  top: 168px;
  left: 20px;
  z-index: 10;
  background-color: rgb(230, 240, 233);
  padding: 10px;
  border-radius: 5px;
  width: 478px;
  height: 700px;
}

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

.login-title {
  flex: 1;
  text-align: center;
  margin: 0;
  padding-left: 30px;
}
</style>
