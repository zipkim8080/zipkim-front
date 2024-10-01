<script setup>
import { ref, onMounted } from 'vue';

const propInfo = ref(null);

// onMounted(async () => {
//   const response = await fetch('/api/prop/{id}');
//   propInfo.value = await response.json();
// });
</script>

<template>
  <div class="modal-backdrop">
    <div class="modal-container">
      <div class="mt-3 mx-auto" style="height: 500px; width: 1300px">
        <div class="info-container">
          <div class="left-left">
            <div>등기확인</div>
            <div>HUG 인증여부</div>
            <br />
            <div>주소: XX시 XX구 XX동</div>
            <div>가격정보: 매매가 / 전세가</div>
            <br />
            <div>중개인의 한마디</div>
            <div class="agent-comment-box">
              <!-- 입력되는 사항 여기로 들어옴-->
              제가 자부하는 최상급 매물입니다 ^^
            </div>
          </div>
          <div class="right-left">
            <div>[사진들어오는곳]</div>
          </div>
        </div>
        <br />
        <br />
        <h4>[매물정보]</h4>
        <hr style="width: 100%; height: 3px; background-color: black" />
        <div class="info-container">
          <div class="left">
            <div class="info-container">
              <div class="left-left">
                <div>매물유형</div>
                <div>해당층/전체층</div>
                <div>면적</div>
                <div>방/욕실</div>
              </div>
              <div class="right-left">
                <div>아파트</div>
                <div>34평</div>
              </div>
            </div>
          </div>
          <div class="right">
            <div class="info-container">
              <div class="left-left">
                <div>현관타입</div>
                <div>주차가능여부</div>
                <div>엘베유무</div>
                <div>주변정보</div>
              </div>
              <div class="right-left">
                <div>타워형</div>
                <div>{{ propInfo?.parking ? '가능' : '불가능' }}</div>
                <div>있음</div>
                <div>편의점, 슈퍼</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <br />
      <h4>[등기정보]</h4>
      <hr style="width: 100%; height: 4px; background-color: black" />
      <div>등기고유번호</div>
      <div>위험요소유무</div>
      <div>근저당(총액)</div>
    </div>
  </div>
</template>

<style>
.modal-backdrop {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  z-index: 1000;
}
.modal-container {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 50px;
  border-radius: 10px;
  z-index: 1001;
  box-shadow: rgba(0, 0, 0, 0.2);
}
.info-container {
  display: flex;
  justify-content: space-between;
}
.left,
.right {
  width: 48%; /* 각각의 열 너비를 설정 */
}
.left-left,
.right-left {
  width: 48%;
}
.agent-comment-box {
  border: 1px solid #ccc;
  padding: 10px;
  height: 100px; /* 원하는 높이 설정 */
  margin-top: 10px; /* 위쪽 여백 추가 */
  background: #f9f9f9; /* 배경색 설정 */
}
</style>
