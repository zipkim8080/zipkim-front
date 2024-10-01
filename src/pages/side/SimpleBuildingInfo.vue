<script setup>
import PropertyList from '@/components/detail/propertyList.vue';
import { useRouter, useRoute } from 'vue-router';
import { useKakaoMapStore } from '@/stores/KakaoMapStore';
import { useComplexesStore } from '@/stores/ComplexesStore';
import { onMounted, reactive, watch } from 'vue';
import axios from 'axios';
const kakaoMapStore = useKakaoMapStore();
const complexesStore = useComplexesStore();
const router = useRouter();
const route = useRoute();

onMounted(() => {
  const id = route.params.complexId; // 'id' 파라미터를 가져옵니다.
  fetchPropertyData(id)
  console.log(id); // 가져온 id를 사용할 수 있습니다.
});

watch(
  () => route.params.complexId,
  (newId, oldId) => {
    console.log(`ID가 변경되었습니다: ${oldId} -> ${newId}`);
    fetchPropertyData(newId)
    // 새로운 ID로 작업 수행
    // fetchData(newId); // 예시: 데이터 가져오기
  }
);
function close() {
  complexesStore.restoreState();
  kakaoMapStore.reposition(complexesStore.lat, complexesStore.lon);
  router.push({ name: 'Main' }); // 메인 페이지로 돌아가 모달 닫기
}

const complexInfo = reactive({
  id: "",
  bgdCd: "",
  complexName: "",
  addressName: "",
  mainAddressNo: "",
  recentAmount: 0,
  recentDeposit: 0,
  roadName: "",
  subAddressNo: "",
  areas: [
    {
      id: "",
      supplyArea: "",
      pyeongName: "",
    }
  ],
});
async function fetchPropertyData(complexId) {
  try {
    const data = (await axios.get(`/api/complex/summary?complexId=${complexId}`)).data; // API 호출
    complexInfo.id = data.id;
    complexInfo.bgdCd = data.bgdCd;
    complexInfo.addressName = data.addressName;
    complexInfo.complexName = data.complexName;
    complexInfo.mainAddressNo = data.mainAddressNo;
    complexInfo.recentAmount = data.recentAmount;
    complexInfo.recentDeposit = data.recentDeposit;
    complexInfo.roadName = data.roadName;
    complexInfo.subAddressNo = data.subAddressNo;
    complexInfo.areas = data.areas;
    console.log(complexInfo)
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
    단지아이디: {{ complexInfo.id }}
    단지이름: {{ complexInfo.complexName }}
    도로명: {{ complexInfo.roadName }}
    지번주소: {{ complexInfo.addressName }}
    최근 실거래 매매가: {{ complexInfo.recentAmount }}
    최근 실거래 전세가: {{ complexInfo.recentDeposit }}
    면적정보:
    <ul>
      <li v-for="(area, index) in complexInfo.areas" :key="index">
        면적아이디: {{ area.id }}, 공급면적: {{ area.supplyArea }}, 평: {{ area.pyeongName }}
      </li>
    </ul>
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
