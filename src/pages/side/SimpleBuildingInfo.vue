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
  fetchPropertyData(id);
  console.log(id); // 가져온 id를 사용할 수 있습니다.
});

watch(
  () => route.params.complexId,
  (newId, oldId) => {
    console.log(`ID가 변경되었습니다: ${oldId} -> ${newId}`);
    fetchPropertyData(newId);
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
  id: '',
  bgdCd: '',
  complexName: '',
  addressName: '',
  mainAddressNo: '',
  recentAmount: 0,
  recentDeposit: 0,
  roadName: '',
  subAddressNo: '',
  areas: [
    {
      id: '',
      supplyArea: '',
      pyeongName: '',
    },
  ],
});
const propList = reactive({
  items: [],
});
async function fetchPropertyData(complexId) {
  try {
    const data = (await axios.get(`/api/complex/summary?complexId=${complexId}`)).data; // API 호출
    const props = await axios.get(`/api/prop-list?complexId=${complexId}`);
    propList.items = props.data.content;
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
    console.log(complexInfo);
    // complexesStore or other stores에 필요한 데이터 저장
  } catch (error) {
    console.error('Error fetching property data:', error);
  }
}
</script>

<template>
  <div class="cInfo-overlay">
    <div class="title-box">
      <div class="content-container">
        <div class="title">
          <h2>{{ complexInfo.complexName }}</h2>
          <br />
          <button class="close-btn" @click="close">
            <i class="fa-solid fa-x"></i>
          </button>
        </div>
        <!-- 단지아이디: {{ complexInfo.id }} -->
        <!-- <h5 style="font-weight: bold">사진</h5> -->
        <div class="chart-box">사진</div>
        <br />
        <h5 style="font-weight: bold">주소</h5>
        <div>도로명 주소: {{ complexInfo.roadName }}</div>
        <div>지번 주소: {{ complexInfo.addressName }}</div>
        <br />
        <h5 style="font-weight: bold">최근 실거래가</h5>
        <div>매매가: {{ complexInfo.recentAmount.toLocaleString() }} 만원</div>
        <div>전세가: {{ complexInfo.recentDeposit.toLocaleString() }} 만원</div>
        <br />
        <h5 style="font-weight: bold">차트</h5>
        <div class="chart-box"></div>

        <hr />
        <PropertyList :propList="propList.items" />
      </div>
    </div>
    <!-- 면적정보:
    <ul>
      <li v-for="(area, index) in complexInfo.areas" :key="index">
        면적아이디: {{ area.id }}, 공급면적: {{ area.supplyArea }}, 평: {{ area.pyeongName }}
      </li>
    </ul> -->
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
  margin: 30px; /* 임의로 설정함 */
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
  margin-top: 2px;
  padding-left: 30px;
  color: #955a1f;
}

.content-container {
  padding: 3%;
  background-color: white;
  height: 680px;
  overflow-y: auto;
}

::-webkit-scrollbar {
  display: none;
}

.chart-box {
  border: 1px solid #ccc;
  padding: 10px;
  height: 200px;
  margin-top: 10px;
  background: #f9f9f9;
}
</style>
