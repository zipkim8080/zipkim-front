<template>
  <div>
    <div class="width1">주소 검색</div>
    <div class="cover mb-1">
      <select
        name="si"
        id="si"
        class="form-control firstLine"
        v-model="selectedSi"
      >
        <option>시/도</option>
        <option>서울특별시</option>
      </select>
      <!--  -->
      <select
        name="gu"
        id="gu"
        class="form-control firstLine"
        v-model="selectedGu"
        @change="selectedDong = '읍/면/동'"
        :disabled="isSiDisabled"
      >
        <option disabled>시/군/구</option>
        <option
          v-for="sgg in sggList"
          :key="sgg.cortarNo"
          :value="sgg.cortarNo"
        >
          {{ sgg.cortarName }}
        </option>
      </select>
      <!--  -->
      <select
        name="dong"
        id="dong"
        class="form-control"
        v-model="selectedDong"
        :disabled="isUmdDisabled"
        @change="getComplexesApi"
      >
        <option disabled>읍/면/동</option>
        <option
          v-for="umd in filteredUmdList"
          :key="umd.cortarNo"
          :value="umd.cortarNo"
        >
          {{ umd.cortarName }}
        </option>
      </select>
    </div>
    <!--  -->
    <div ref="autocompleteWrapper">
      <div class="autocomplete-wrapper">
        <input
          type="text"
          class="form-control mb-1"
          placeholder="단지검색"
          v-model="searchQuery"
          :disabled="isSearchDisabled"
        />
        <div class="complexSuggestion2" v-if="showDropdown">
          <ul>
            <li
              v-for="a in filteredData"
              :key="a.complexId"
              :value="a.complexId"
              @click="selectItem(a.complexId, a.name)"
            >
              <div class="suggestion-content">
                <p style="font-size: 16px; font-weight: 500">
                  {{ a.name }}
                </p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <!--  -->
    <input
      type="text"
      class="form-control"
      id="detailAddress"
      name="detailAddress"
      v-model="detailAddress"
      @input="emitAddressData"
      placeholder="상세주소"
    />
  </div>
</template>
<script setup>
import { ref, onMounted, defineEmits, computed } from 'vue';
const emit = defineEmits(['addressSelected']);
import sggData from '@/data/sgg.json'; // sgg.json 파일을 가져옵니다.
import umdData from '@/data/umd.json';
import axios from '@/api/index';

// JSON 데이터 가져오기
const sggList = ref(sggData.regionList);
const umdList = ref(umdData.regionList);
const apiData = ref([]);
const simpleApi = ref([]);

// 비활성화 처리
const selectedSi = ref('시/도');
const selectedGu = ref('시/군/구');
const selectedDong = ref('읍/면/동');
// 전달 인자
const detailAddress = ref('');
const roadAddress = ref('');
const mainAddressNo = ref('');
const subAddressNo = ref('');
const bcode = ref('');
const jibunAddress = ref('');
const longitude = ref(null); // 위도
const latitude = ref(null); // 경도
const complexId = ref();

// 기타 처리 사항
const searchQuery = ref(''); // 검색어
const complexSuggestion = ref([]); // 자동완성 목록
const timeout = ref(null); // 입력 지연 타이머
const showDropdown = ref(false);
const autocompleteWrapper = ref(null); // 자동완성 기능의 래퍼

// 시군구 매칭
const sggDongLink = (item) => {
  return item.toString().substring(0, 5);
};

// 조건에 맞는 데이터만 필터링하여 반환
const filteredUmdList = computed(() => {
  return umdList.value.filter(
    (umd) => sggDongLink(umd.cortarNo) === sggDongLink(selectedGu.value)
  );
});

// 읍/면/동 선택 비활성화 상태 확인
const isSiDisabled = computed(() => selectedSi.value === '시/도');
const isUmdDisabled = computed(() => selectedGu.value === '시/군/구');
const isSearchDisabled = computed(() => selectedDong.value === '읍/면/동');

// 단지 api
const getComplexesApi = async () => {
  const url = `/api/select-info?bgdCd=${selectedDong.value}`;
  try {
    const response = await axios.get(url);
    apiData.value = response.data.map((item) => ({
      ...item,
      longitude: item.longitude, // 위도 데이터
      latitude: item.latitude, // 경도 데이터
    })); // 데이터를 상태에 저장
    // console.log(longitude.value, latitude.value);
  } catch (error) {
    console.error('데이터를 가져오는 중 에러 발생:', error);
    apiData.value = []; // 에러 발생 시 데이터를 빈 배열로 초기화
  }
};

// 다른 곳 클릭 시 드롭다운을 닫는 함수
const handleClickOutside = (event) => {
  // console.log(autocompleteWrapper.value)
  if (
    autocompleteWrapper.value &&
    !autocompleteWrapper.value.contains(event.target)
  ) {
    showDropdown.value = false; // 드롭다운 닫기
  } else {
    showDropdown.value = true;
  }
};
// 검색 함수
const filteredData = computed(() => {
  if (!searchQuery.value) {
    return apiData.value;
  }
  return apiData.value.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

//클릭 이벤트
const selectItem = async (item, itemName) => {
  complexId.value = item;
  searchQuery.value = itemName;
  showDropdown.value = false;
  const selectedComplex = apiData.value.find(
    (item) => item.complexId === complexId.value
  );

  // 해당 ID에 맞는 longitude, latitude 값 추출
  longitude.value = selectedComplex?.longitude || null;
  latitude.value = selectedComplex?.latitude || null;

  const url = `/api/complex/summary?complexId=${item}`;
  try {
    const response = await axios.get(url);
    simpleApi.value = response.data; // 데이터를 상태에 저장
    roadAddress.value = simpleApi.value.roadName;
    mainAddressNo.value = simpleApi.value.mainAddressNo;
    subAddressNo.value = simpleApi.value.subAddressNo;
    bcode.value = simpleApi.value.bgdCd;
    jibunAddress.value = simpleApi.value.addressName;
    complexId.value = simpleApi.value.id;
  } catch (error) {
    console.error('데이터를 가져오는 중 에러 발생:', error);
  }
};
// 데이터 부모 컴포넌트로 전달
const emitAddressData = () => {
  emit('addressSelected', {
    detailAddress: detailAddress.value,
    roadAddress: roadAddress.value,
    mainAddressNo: mainAddressNo.value,
    subAddressNo: subAddressNo.value,
    bcode: bcode.value,
    jibunAddress: jibunAddress.value,
    complexId: complexId.value,
    longitude: longitude.value,
    latitude: latitude.value,
  });
};
onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});
</script>

<style>
.cover {
  display: flex;
}
.width1 {
  width: 479px;
}
.firstLine {
  margin-right: 4px;
}
.autocomplete-wrapper {
  position: relative;
}
.complexSuggestion2 {
  position: absolute;
  top: 100%; /* 검색창 바로 아래에 위치 */
  left: 0;
  background-color: white;
  border: 1px solid #f3b706;
  z-index: 999;
  max-height: 300px;
  border-radius: 5px;
  width: 100%;
  overflow-y: auto;
  /* 세로 방향 스크롤 허용 */
}

.complexSuggestion2 ul {
  list-style-type: none;
  padding-left: 0;
}

.complexSuggestion2 li {
  padding-top: 10px;
}

.complexSuggestion2 p {
  margin-bottom: 2px;
  padding-left: 10px;
}
</style>
