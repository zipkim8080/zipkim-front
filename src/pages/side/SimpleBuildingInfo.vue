<script setup>
import axios from 'axios';
import { useRouter, useRoute } from 'vue-router';
import { useKakaoMapStore } from '@/stores/KakaoMapStore';
import { useComplexesStore } from '@/stores/ComplexesStore';
import { onMounted, reactive, watch, ref } from 'vue';
import PropertyList from '@/components/detail/propertyList.vue';
import PriceChart from '@/components/detail/PriceChart.vue';

const kakaoMapStore = useKakaoMapStore();
const complexesStore = useComplexesStore();
const router = useRouter();
const route = useRoute();
const basePath = "/images/";
const images = ["building1.jpeg", "building2.jpeg", "building3.jpeg", "building4.jpeg", "building5.jpeg", "building6.jpeg", "building7.jpeg", "building8.jpeg", "building9.jpeg", "building10.jpeg"]
onMounted(() => {
  const id = route.params.complexId; // 'id' 파라미터를 가져옵니다.
  fetchPropertyData(id);
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
  img: '',
  type: '',
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

const priceChart = reactive({});
const areaIdToPyeongName = reactive({});

const handlePageChange = async (pageNum, event) => {
  pageRequest.page = pageNum;
  await fetchPropertyData(route.params.complexId);
};

async function fetchPropertyData(complexId) {
  try {
    const data = (
      await axios.get(`/api/complex/summary?complexId=${complexId}`)
    ).data; // API 호출
    const props = await axios.get(
      `/api/prop-list?complexId=${complexId}&page=${pageRequest.page - 1
      }&size=2`
    );
    const areaIds = data.areas.map((area) => area.id);
    const areaPyeongNames = data.areas.map((area) => area.pyeongName);

    for (let member in priceChart) delete priceChart[member];
    for (let member in areaIdToPyeongName) delete areaIdToPyeongName[member];
    const combinedChartData = {};
    const combinedAreaPyeong = {};
    for (const [index, areaId] of areaIds.entries()) {
      // areaIdToPyeongName[areaId] = areaPyeongNames[index];
      combinedAreaPyeong[areaId] = areaPyeongNames[index];
      combinedChartData[areaId] = await fetchChartData(areaId);
    }
    for (const areaId in combinedChartData) {
      priceChart[areaId] = combinedChartData[areaId];
    }
    for (const areaId in combinedAreaPyeong) {
      areaIdToPyeongName[areaId] = combinedAreaPyeong[areaId];
    }
    // console.log(combinedAreaPyeong)
    // console.log(priceChart)
    // console.log(priceChart)
    // console.log('===================')
    // console.log(areaIdToPyeongName)
    propList.items = props.data.content;
    propList.pageable = props.data.pageable;
    propList.totalElements = props.data.totalElements;
    propList.totalPages = props.data.totalPages;
    propList.numberOfElements = props.data.numberOfElements;
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
    complexInfo.type = data.type;
    complexInfo.img = basePath + images[Math.floor(Math.random() * images.length)];
    // complexesStore or other stores에 필요한 데이터 저장
  } catch (error) {
    console.error('Error fetching property data:', error);
  }
}

const pageRequest = reactive({
  page: propList.pageable.pageNumber || 1,
});

async function fetchChartData(areaId) {
  try {
    // 매매 가져오기
    const saleResponse = await axios.get(
      `/api/price?areaId=${areaId}&type=SALE`
    );
    const saleData = saleResponse.data.content;

    // 전세 가져오기
    const leaseResponse = await axios.get(
      `/api/price?areaId=${areaId}&type=LEASE`
    );
    const leaseData = leaseResponse.data.content;

    const chartInfo = { data: {} };

    chartInfo.data[areaId] = {
      saleContent: saleData.map((item) => ({
        tradeYear: item.tradeYear,
        tradeMonth: item.tradeMonth,
        dealPrice: item.dealPrice,
        formattedPrice: item.formattedPrice,
        transactionType: item.transactionType,
      })),
      leaseContent: leaseData.map((item) => ({
        tradeYear: item.tradeYear,
        tradeMonth: item.tradeMonth,
        dealPrice: item.dealPrice,
        formattedPrice: item.formattedPrice,
        transactionType: item.transactionType,
      })),
    };

    // priceChart: areaId가 key고, *Content가 value인 object
    return [].concat(
      chartInfo.data[areaId].saleContent,
      chartInfo.data[areaId].leaseContent
    );
  } catch (error) {
    console.log('Error fetching chart data:', error);
  }
}
</script>

<template>
  <div class="cInfo-overlay">
    <div class="sBuilding-title-box">
      <div class="content-container">
        <div class="title">
          <h2 class="complex-name">{{ complexInfo.complexName }}</h2>
          <button class="close-btn" @click="close">
            <i class="fa-solid fa-x"></i>
          </button>
        </div>
        <div v-if="complexInfo.type == 'opi' || complexInfo.type == 'apt'">
          <img width="424px" height="200px" :src="complexInfo.img"></img>
          <br />
          <h5 style="font-weight: bold">주소</h5>
          <div>도로명 주소: {{ complexInfo.roadName }}</div>
          <div>지번 주소: {{ complexInfo.addressName }}</div>
          <br />
          <h5 style="font-weight: bold">최근 실거래가</h5>
          <div>
            매매가: {{ complexInfo.recentAmount.toLocaleString() }} 만원
          </div>
          <div>
            전세가: {{ complexInfo.recentDeposit.toLocaleString() }} 만원
          </div>
          <hr style="width: 100%; height: 10px; background-color: #ccc" />
          <PriceChart v-if="priceChart" :priceChart="priceChart" :areaIdToPyeongName="areaIdToPyeongName" />
        </div>
        <hr style="width: 100%; height: 10px; background-color: #ccc" />
        <PropertyList :propList="propList" />
        <template v-if="propList.totalElements > 0">
          <div class="paginate">
            <vue-awesome-paginate :total-items="propList.totalElements" :items-per-page="propList.pageable.pageSize"
              :max-pages-shown="propList.totalPages" :show-ending-buttons="false" v-model="pageRequest.page"
              @click="handlePageChange">
              <template #first-page-button><i class="fa-solid fa-backward-fast"></i></template>
              <template #prev-button><i class="fa-solid fa-caret-left"></i></template>
              <template #next-button><i class="fa-solid fa-caret-right"></i></template>
              <template #last-page-button><i class="fa-solid fa-forward-fast"></i></template>
            </vue-awesome-paginate>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<style scope>
.paginate {
  padding-top: 13.5px;
  text-align: center;
  /* margin-top: 10px; */
  height: 55px;
}

.cInfo-overlay {
  position: absolute;
  top: 168px;
  left: 20px;
  z-index: 10;
  background-color: #ffecb3;
  padding: 10px;
  border-radius: 5px;
  width: 471px;
}

.sBuilding-title-box {
  width: 500px;
  padding-top: 0;
  height: 100%;
}

.title {
  display: flex;
  justify-content: space-between;
  /* 닫기 버튼을 오른쪽으로 이동 */
  align-items: center;
  padding: 5px;
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
  padding: 13.5px;
  background-color: white;
  height: 100%;
  border-radius: 5px;
  overflow-y: auto;
  /* display: flex; */
  flex-direction: column;
  justify-content: center;
  /* 수직 중앙 정렬 */
}

.complex-name {
  text-align: center;
  /* 가운데 정렬 */
  flex-grow: 1;
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
