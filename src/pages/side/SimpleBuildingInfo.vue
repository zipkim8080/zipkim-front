<script setup>
import PropertyList from '@/components/detail/propertyList.vue';
import { useRouter, useRoute } from 'vue-router';
import { useKakaoMapStore } from '@/stores/KakaoMapStore';
import { useComplexesStore } from '@/stores/ComplexesStore';
import { onMounted, watch } from 'vue';
const kakaoMapStore = useKakaoMapStore();
const complexesStore = useComplexesStore();
const router = useRouter();
const route = useRoute();
onMounted(() => {
  const id = route.params.complexId; // 'id' 파라미터를 가져옵니다.
  console.log(id); // 가져온 id를 사용할 수 있습니다.
});

watch(
  () => route.params.complexId,
  (newId, oldId) => {
    console.log(`ID가 변경되었습니다: ${oldId} -> ${newId}`);
    // 새로운 ID로 작업 수행
    // fetchData(newId); // 예시: 데이터 가져오기
  }
);
function close() {
  complexesStore.restoreState();
  kakaoMapStore.reposition(complexesStore.lat, complexesStore.lon);
  router.push({ name: 'Main' }); // 메인 페이지로 돌아가 모달 닫기
}

const complexId = '';
async function fetchPropertyData() {
  try {
    const response = await axios.get(
      `/api/complex/summary?complexId=${complexId}`
    ); // API 호출
    console.log(response.data); // 응답 데이터 처리
    // complexesStore or other stores에 필요한 데이터 저장
  } catch (error) {
    console.error('Error fetching property data:', error);
  }
}
</script>

<template>
  <div class="cInfo-overlay">
    <div class="title-box">
      <div class="title">
        <h1 class="login-title">간략한 건물정보</h1>
        <button class="close-btn" @click="close">
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
  background-color: #ffecb3;
  padding: 10px;
  border-radius: 5px;
  width: 471px;
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
  color: #955a1f;
}
</style>
