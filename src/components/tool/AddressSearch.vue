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
    <input type="hidden" v-model="buildingMainAddressNo" />
    <input type="hidden" v-model="buildingSubAddressNo" />
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
      longitude: '',
      latitude: '',
      buildingMainAddressNo: '',
      buildingSubAddressNo: '',
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
    loadScript(src) {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    },
    execDaumPostcode() {
      if (typeof daum === 'undefined' || typeof daum.Postcode === 'undefined') {
        console.error('Daum Postcode script is not loaded.');
        return;
      }
      new daum.Postcode({
        oncomplete: (data) => {
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

          // 주소가 변경될 때 좌표를 가져옴
          this.fetchCoordinates();
        },
      }).open();
    },
    fetchCoordinates() {
      const query = this.roadAddress;
      if (query) {
        const apiKey = 'KakaoAK 609c68dddc59d91ca2017c852a101b1b'; // 여기에 API 키를 넣으세요
        const apiUrl = `https://dapi.kakao.com/v2/local/search/address.json?query=${query}`;

        fetch(apiUrl, {
          method: 'GET',
          headers: {
            Authorization: apiKey,
          },
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.documents.length > 0) {
              const { x, y, main_building_no, sub_building_no } =
                data.documents[0].road_address;
              this.longitude = x;
              this.latitude = y;
              this.buildingMainAddressNo = main_building_no;
              this.buildingSubAddressNo = sub_building_no;
              console.log(
                `Longitude: ${this.longitude}, Latitude: ${this.latitude}`
              );

              // 좌표를 부모 컴포넌트로 전달
              this.$emit('addressSelected', {
                postcode: this.postcode,
                roadAddress: this.roadAddress,
                jibunAddress: this.jibunAddress,
                extraAddress: this.extraAddress,
                bcode: this.bcode,
                longitude: this.longitude,
                latitude: this.latitude,
                buildingMainAddressNo: this.buildingMainAddressNo,
                buildingSubAddressNo: this.buildingSubAddressNo,
              });
            }
          })
          .catch((error) =>
            console.error('Error fetching coordinates:', error)
          );
      }
    },
  },
};
</script>
