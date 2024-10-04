<script setup>
import axios from 'axios';
import { useRouter, useRoute } from 'vue-router';
import { useKakaoMapStore } from '@/stores/KakaoMapStore';
import { useComplexesStore } from '@/stores/ComplexesStore';
import { onMounted, reactive, watch } from 'vue';
import PropertyList from '@/components/detail/propertyList.vue';

const kakaoMapStore = useKakaoMapStore();
const complexesStore = useComplexesStore();
const router = useRouter();
const route = useRoute();

onMounted(() => {
  const id = route.params.complexId; // 'id' 파라미터를 가져옵니다.
  fetchPropertyData(id);
  // fetchChartData(areaId, type);
  // console.log('뭐가나올까', areaId, type);
});

watch(
  () => route.params.complexId,
  (newId, oldId) => {
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
  pageable: '', //현재 페이지정보
  totalElements: '', // 총 아이템수
  totalPages: '', //총 페이지
  numberOfElements: '', //현재페이지 아이템수
});
const chartInfo = reactive({
  saleContent: [], // 매매
  leaseContent: [], // 전세
  // content: [
  //   {
  //     tradeYear: '',
  //     tradeMonth: '',
  //     dealPrice: 0, // 106500
  //     formattedPrice: '', // 10억 6,500
  //     // transactionType => 나눠야 하는지?
  //   }
  // ]
});
async function fetchPropertyData(complexId) {
  try {
    const data = (await axios.get(`/api/complex/summary?complexId=${complexId}`)).data; // API 호출
    const props = await axios.get(`/api/prop-list?complexId=${complexId}&page=0&size=2`);
    const areaIds = data.areas.map((area) => area.id);
    console.log('areaId뽑기', areaIds);

    for (const areaId of areaIds) {
      await fetchChartData(areaId);
    }

    propList.items = props.data.content;
    propList.pageable = props.data.pageable;
    propList.totalElements = props.data.totalElements;
    propList.totalPages = props.data.totalPages;
    propList.numberOfElements = props.data.numberOfElements;
    console.log(propList);
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
    // complexesStore or other stores에 필요한 데이터 저장
  } catch (error) {
    console.error('Error fetching property data:', error);
  }
}
async function fetchChartData(areaId) {
  try {
    // 매매 가져오기
    const saleResponse = await axios.get(`/api/price?areaId=${areaId}&type=SALE`);
    const saleData = saleResponse.data.content;

    // 전세 가져오기
    const leaseResponse = await axios.get(`/api/price?areaId=${areaId}&type=LEASE`);
    const leaseData = leaseResponse.data.content;

    // chartInfo에 저장 - 매매
    chartInfo.saleContent.push(
      ...saleData.map((item) => ({
        tradeYear: item.tradeYear,
        tradeMonth: item.tradeMonth,
        dealPrice: item.dealPrice,
        formattedPrice: item.formattedPrice,
        transactionType: item.transactionType,
      }))
    );

    // chartInfo에 저장 - 전세
    chartInfo.leaseContent.push(
      ...leaseData.map((item) => ({
        tradeYear: item.tradeYear,
        tradeMonth: item.tradeMonth,
        dealPrice: item.dealPrice,
        formattedPrice: item.formattedPrice,
        transactionType: item.transactionType,
      }))
    );

    console.log('chartInfo: ', chartInfo);
  } catch (error) {
    console.log('Error fetching chart data:', error);
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
        <!-- <PriceChart :priceChart="priceChart" /> -->
        <canvas id="myChart" width="450" height="600"></canvas>
        <hr />
        <PropertyList :propList="propList" />
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
  margin: 30px;
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
