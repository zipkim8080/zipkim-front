<script>
export default {
  data() {
    return {
      //주소 입력 부분
      postcode: '',
      roadAddress: '',
      jibunAddress: '',
      extraAddress: '',
      guideMessage: '',
      guideVisible: false,
      bcode: '',
      bname: '',
    };
  },
  mounted() {
    this.loadScript(
      '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js'
    )
      .then(() => {
        console.log('Daum Postcode script loaded');
      })
      .catch((error) => {
        console.error('Failed to load Daum Postcode script:', error);
      });
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

          // 주소 정보를 부모 컴포넌트로 전달
          this.$emit('addressSelected', {
            postcode: data.zonecode,
            roadAddress: roadAddr,
            jibunAddress: data.jibunAddress,
            extraAddress: extraRoadAddr,
            bcode: data.bcode,
            bname: data.bname,
          });

          this.postcode = data.zonecode;
          this.roadAddress = roadAddr;
          this.jibunAddress = data.jibunAddress;
          this.extraAddress = roadAddr ? extraRoadAddr : '';
          this.bcode = data.bcode;
          this.bname = data.bname;

          if (data.autoRoadAddress) {
            this.guideMessage = `(예상 도로명 주소 : ${
              data.autoRoadAddress + extraRoadAddr
            })`;
            this.guideVisible = true;
          } else if (data.autoJibunAddress) {
            this.guideMessage = `(예상 지번 주소 : ${data.autoJibunAddress})`;
            this.guideVisible = true;
          } else {
            this.guideMessage = '';
            this.guideVisible = false;
          }
        },
      }).open();
    },
  },
};
</script>

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
    <input type="hidden" v-model="bname" />
  </div>
</template>
