<template>
  <div>
    <input type="text" v-model="postcode" placeholder="우편번호" />
    <input
      type="button"
      @click="execDaumPostcode"
      value="우편번호 찾기"
    /><br />
    <input type="text" v-model="roadAddress" placeholder="도로명주소" />
    <input type="text" v-model="jibunAddress" placeholder="지번주소" />
    <span v-if="guideVisible" id="guide" style="color: #999">{{
      guideMessage
    }}</span
    ><br />
    <input type="text" v-model="extraAddress" placeholder="참고항목" />
    <input type="hidden" v-model="bcode" />
    <input type="hidden" v-model="longitude" />
    <input type="hidden" v-model="latitude" />
    <input type="hidden" v-model="mainAddressNo" />
    <input type="hidden" v-model="subAddressNo" />
    <input type="hidden" v-model="complexName" />
    <input type="hidden" v-model="type" />
    <input type="hidden" v-model="recentDeposit" />
    <input type="hidden" v-model="recentAmount" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      postcode: '',
      roadAddress: '',
      jibunAddress: '',
      extraAddress: '',
      guideMessage: '',
      guideVisible: false,
      bcode: '',
      // kakao map 주소검색
      longitude: '',
      latitude: '',
      mainAddressNo: '',
      subAddressNo: '',
      // 서울시 전월세가
      complexName: '',
      type: '',
      recentDeposit: 0,
      // 서울시 실거래가
      recentAmount: 0,
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

          try {
            // 주소가 변경될 때 좌표, 본번 부번을 가져옴
            await this.fetchCoordinates();
            // 주소가 변경될 때 건물명, 건물유형, 전세보증금을 가져옴
            await this.buildingDepositApi();
            await this.buildingAmountApi();
          } catch (error) {
            console.error('좌표 또는 데이터 가져오기 중 오류 발생:', error);
          }
        },
      }).open();
    },

    // 서울시 전월세가 api
    async buildingDepositApi() {
      const bdgCd = this.bcode.toString().slice(-5); // 5자리로 자르기
      const mainBun = this.mainAddressNo.toString().padStart(4, '0'); // 빈곳 앞에서 부터 0으로 채워서 4자리 만들기
      const subBun = this.subAddressNo.toString().padStart(4, '0');
      const apiUrl = `http://openapi.seoul.go.kr:8088/754e556a7964657636395270774b56/json/tbLnOpendataRentV/1/5/2024/ / /${bdgCd}/ /${mainBun}/${subBun}/`;

      try {
        const response = await fetch(apiUrl, {
          method: 'GET',
        });
        const data = await response.json();

        if (
          data.tbLnOpendataRentV &&
          data.tbLnOpendataRentV.row &&
          data.tbLnOpendataRentV.row.length > 0
        ) {
          const { BLDG_NM, BLDG_USG, GRFE } = data.tbLnOpendataRentV.row[0];
          console.log(BLDG_NM, BLDG_USG, GRFE, apiUrl);

          this.complexName = BLDG_NM;
          this.type = BLDG_USG;
          this.recentDeposit = GRFE;

          this.emitAddressData();
        } else {
          console.error('데이터가 없습니다.');
        }
      } catch (error) {
        console.error('API 요청 중 오류 발생:', error);
      }
    },

    // 서울시 실거래가 api
    async buildingAmountApi() {
      const bdgCd = this.bcode.toString().slice(-5); // 5자리로 자르기
      const mainBun = this.mainAddressNo.toString().padStart(4, '0'); // 빈곳 앞에서 부터 0으로 채워서 4자리 만들기
      const subBun = this.subAddressNo.toString().padStart(4, '0');
      const apiUrl = `http://openapi.seoul.go.kr:8088/754e556a7964657636395270774b56/json/tbLnOpendataRtmsV/1/5/2024/ / /${bdgCd}/ / /${mainBun}/${subBun}/`;

      try {
        const response = await fetch(apiUrl, {
          method: 'GET',
        });
        const data = await response.json();

        if (
          data.tbLnOpendataRtmsV &&
          data.tbLnOpendataRtmsV.row &&
          data.tbLnOpendataRtmsV.row.length > 0
        ) {
          const { THING_AMT } = data.tbLnOpendataRtmsV.row[0];
          console.log(THING_AMT + '' + apiUrl);

          this.recentAmount = THING_AMT;

          this.emitAddressData();
        } else {
          console.error('데이터가 없습니다.');
        }
      } catch (error) {
        console.error('API 요청 중 오류 발생:', error);
      }
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
      this.complexName = '';
      this.type = '';
      this.recentDeposit = 0;
      this.recentAmount = 0;
    },

    emitAddressData() {
      this.$emit('addressSelected', {
        postcode: this.postcode,
        roadAddress: this.roadAddress,
        jibunAddress: this.jibunAddress,
        extraAddress: this.extraAddress,
        bcode: this.bcode,
        longitude: this.longitude,
        latitude: this.latitude,
        mainAddressNo: this.mainAddressNo,
        subAddressNo: this.subAddressNo,
        complexName: this.complexName,
        type: this.type,
        recentDeposit: this.recentDeposit,
        recentAmount: this.recentAmount,
      });
    },
  },
};
</script>
