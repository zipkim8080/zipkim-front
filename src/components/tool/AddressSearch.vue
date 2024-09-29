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

  <input type="hidden" v-model="bcode" />
  <input type="hidden" v-model="longitude" />
  <input type="hidden" v-model="latitude" />
  <input type="hidden" v-model="mainAddressNo" />
</template>

<script>
export default {
  data() {
    return {
      postcode: '',
      roadAddress: '',
      jibunAddress: '',
      extraAddress: '',
      bcode: '',
      // kakao map 주소검색
      longitude: '',
      latitude: '',
      mainAddressNo: '',
      subAddressNo: '',
    };
  },
  mounted() {
    this.loadScript(
      '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js'
    )
      .then(() => console.log('Daum Postcode script loaded'))
      .catch((error) =>
        console.error('Failed to load Daum Postcode script:', error)
      );
  },
  emits: ['addressSelected'],
  methods: {
    // kakao map 주소검색 api
    async fetchCoordinates() {
      const query = this.roadAddress;
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
            this.longitude = x;
            this.latitude = y;
            this.mainAddressNo = main_address_no;
            this.subAddressNo = sub_address_no;
            this.emitAddressData();
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
    },

    loadScript(src) {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    },

    async execDaumPostcode() {
      if (typeof daum === 'undefined' || typeof daum.Postcode === 'undefined') {
        console.error('Daum Postcode script is not loaded.');
        return;
      }

      this.resetData();

      new daum.Postcode({
        oncomplete: async (data) => {
          const roadAddr = data.roadAddress;
          let extraRoadAddr = '';

          if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
            extraRoadAddr += data.bname;
          }
          if (data.buildingName !== '' && data.apartment === 'Y') {
            extraRoadAddr +=
              extraRoadAddr !== ''
                ? `, ${data.buildingName}`
                : data.buildingName;
          }
          if (extraRoadAddr !== '') {
            extraRoadAddr = ` (${extraRoadAddr})`;
          }

          this.postcode = data.zonecode;
          this.roadAddress = roadAddr;
          this.jibunAddress = data.jibunAddress;
          this.extraAddress = roadAddr ? extraRoadAddr : '';
          this.bcode = data.bcode;

          this.emitAddressData();

          try {
            // 주소가 변경될 때 좌표, 본번 부번을 가져옴
            await this.fetchCoordinates();
          } catch (error) {
            console.error('좌표 또는 데이터 가져오기 중 오류 발생:', error);
          }
        },
      }).open();
    },

    // 데이터 초기화 메서드
    resetData() {
      this.postcode = '';
      this.roadAddress = '';
      this.jibunAddress = '';
      this.extraAddress = '';
      this.bcode = '';
      this.longitude = '';
      this.latitude = '';
      this.mainAddressNo = '';
      this.subAddressNo = '';
    },

    emitAddressData() {
      this.$emit('addressSelected', {
        roadAddress: this.roadAddress,
        jibunAddress: this.jibunAddress,
        extraAddress: this.extraAddress,
        bcode: this.bcode,
        longitude: this.longitude,
        latitude: this.latitude,
        mainAddressNo: this.mainAddressNo,
        subAddressNo: this.subAddressNo,
      });
    },
  },
};
</script>
