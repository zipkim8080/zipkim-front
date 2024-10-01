<template>
  <div class="input-group mb-1">
    <input
      type="text"
      disabled
      class="form-control"
      v-model="roadAddress"
      placeholder="도로명주소"
    />
    <input
      type="button"
      class="btn btn-warning"
      @click="execDaumPostcode"
      value="주소 검색"
    />
  </div>
  <div class="input-group mb-1">
    <input
      type="text"
      disabled
      class="form-control me-2"
      v-model="jibunAddress"
      placeholder="지번주소"
    />
    <input
      type="text"
      disabled
      class="form-control"
      v-model="extraAddress"
      placeholder="참고항목"
    />
  </div>
  <input
    type="text"
    class="form-control"
    id="detailAddress"
    name="detailAddress"
    v-model="detailAddress"
    @input="emitAddressData"
    placeholder="상세주소"
  />
  <input type="hidden" v-model="bcode" />
  <input type="hidden" v-model="longitude" />
  <input type="hidden" v-model="latitude" />
  <input type="hidden" v-model="mainAddressNo" />
</template>

<script setup>
import { ref, onMounted, defineEmits } from 'vue';

const postcode = ref('');
const roadAddress = ref('');
const jibunAddress = ref('');
const extraAddress = ref('');
const bcode = ref('');
const longitude = ref('');
const latitude = ref('');
const mainAddressNo = ref('');
const subAddressNo = ref('');
const detailAddress = ref('');

const emit = defineEmits(['addressSelected']);

// 스크립트 로드 메서드
const loadScript = (src) => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
};

// Kakao 주소검색 API로 좌표 가져오는 메서드
const fetchCoordinates = async () => {
  const query = roadAddress.value;
  if (query) {
    const apiKey = 'KakaoAK 609c68dddc59d91ca2017c852a101b1b';
    const apiUrl = `https://dapi.kakao.com/v2/local/search/address.json?query=${query}`;

    try {
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          Authorization: apiKey,
        },
      });
      const data = await response.json();
      if (data.documents.length > 0) {
        const { x, y, main_address_no, sub_address_no } =
          data.documents[0].address;
        longitude.value = x;
        latitude.value = y;
        mainAddressNo.value = main_address_no;
        subAddressNo.value = sub_address_no;
        emitAddressData();
      } else {
        throw new Error('주소를 찾을 수 없습니다.');
      }
    } catch (error) {
      console.error('좌표를 가져오는 중 오류 발생:', error);
      throw error;
    }
  } else {
    throw new Error('쿼리가 비어있습니다.');
  }
};

// 주소검색 후 데이터를 emit하는 메서드
const emitAddressData = () => {
  emit('addressSelected', {
    roadAddress: roadAddress.value,
    jibunAddress: jibunAddress.value,
    bcode: bcode.value,
    longitude: longitude.value,
    latitude: latitude.value,
    mainAddressNo: mainAddressNo.value,
    subAddressNo: subAddressNo.value,
    detailAddress: detailAddress.value,
    complexId: '',
  });
};

// 주소 데이터를 초기화하는 메서드
const resetData = () => {
  postcode.value = '';
  roadAddress.value = '';
  jibunAddress.value = '';
  extraAddress.value = '';
  bcode.value = '';
  longitude.value = '';
  latitude.value = '';
  mainAddressNo.value = '';
  subAddressNo.value = '';
};

// 다음 주소 검색 API 실행 메서드
const execDaumPostcode = async () => {
  if (typeof daum === 'undefined' || typeof daum.Postcode === 'undefined') {
    console.error('Daum Postcode script is not loaded.');
    return;
  }

  resetData();

  new daum.Postcode({
    oncomplete: async (data) => {
      const roadAddr = data.roadAddress;
      let extraRoadAddr = '';

      if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
        extraRoadAddr += data.bname;
      }
      if (data.buildingName !== '' && data.apartment === 'Y') {
        extraRoadAddr +=
          extraRoadAddr !== '' ? `, ${data.buildingName}` : data.buildingName;
      }
      if (extraRoadAddr !== '') {
        extraRoadAddr = ` (${extraRoadAddr})`;
      }

      postcode.value = data.zonecode;
      roadAddress.value = roadAddr;
      jibunAddress.value = data.jibunAddress;
      extraAddress.value = roadAddr ? extraRoadAddr : '';
      bcode.value = data.bcode;

      emitAddressData();

      try {
        await fetchCoordinates();
      } catch (error) {
        console.error('좌표 또는 데이터 가져오기 중 오류 발생:', error);
      }
    },
  }).open();
};

// 컴포넌트가 마운트된 후 다음 주소 API 스크립트를 로드합니다.
onMounted(() => {
  loadScript('//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js')
    .then(() => console.log('Daum Postcode script loaded'))
    .catch((error) =>
      console.error('Failed to load Daum Postcode script:', error)
    );
});
</script>
