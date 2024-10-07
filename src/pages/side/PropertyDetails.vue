<script setup>
import axios from 'axios';
import { onMounted, reactive } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

onMounted(() => {
  const id = route.params.propId;
  console.log(id);
  fetchPropertyData(id);
  console.log(id);
});

const propInfo = reactive({
  id: '',
  address: '',
  roadName: '',
  complexName: '',
  detailAddress: '',
  amount: 0,
  deposit: 0,
  floor: '',
  roomNo: '',
  bathNo: '',
  hasConvenience: '',
  hasEv: '',
  hasSchool: '',
  parking: '',
  totalFloor: '',
  brokerId: '',
  complexId: '',
  porch: '',
  createAt: '',
  registerId: '',
  updatedAt: '',
  description: '',
  register: [
    {
      attachMent1: '',
      attachMent2: '',
      auction: '',
      trust: '',
      leaseAmount: 0, // 전세권 금액 => > 0이면 전세권(금액) 띄워주기
      loan: 0,
      uniqueNumber: '', // 고유번호
    },
  ],
  images: [
    [
      {
        id: '',
        imageUrl: '',
      },
    ],
  ],
});
async function fetchPropertyData(propId) {
  try {
    const response = await axios.get(`/api/prop/${propId}`);
    console.log(response);
    const data = response.data;
    propInfo.id = data.id;
    propInfo.address = data.address;
    propInfo.roadName = data.roadName;
    propInfo.complexName = data.complexName;
    propInfo.detailAddress = data.detailAddress;
    propInfo.amount = data.amount;
    propInfo.deposit = data.deposit;
    propInfo.floor = data.floor;
    propInfo.roomNo = data.roomNo;
    propInfo.bathNo = data.bathNo;
    propInfo.hasConvenience = data.hasConvenience;
    propInfo.hasEv = data.hasEv;
    propInfo.hasSchool = data.hasSchool;
    propInfo.parking = data.parking;
    propInfo.totalFloor = data.totalFloor;
    propInfo.brokerId = data.brokerId;
    propInfo.complexId = data.complexId;
    propInfo.porch = data.porch;
    propInfo.registerId = data.registerId;
    propInfo.updatedAt = data.updatedAt;
    propInfo.description = data.description;
    propInfo.attachMent1 = data.register.attachMent1;
    propInfo.attachMent2 = data.register.attachMent2;
    propInfo.auction = data.register.auction;
    propInfo.trust = data.register.trust;
    propInfo.leaseAmount = data.register.leaseAmount;
    propInfo.uniqueNumber = data.register.uniqueNumber;
    propInfo.loan = data.register.loan;
    propInfo.imageUrl = data.images[0].imageUrl;
    console.log(imageUrl);
    console.log(propInfo);
  } catch (error) {
    console.error('Error fetching property data:', error);
  }
}
</script>

<template>
  <div class="modal-backdrop">
    <div class="modal-container">
      <div class="mt-2 mx-auto" style="height: 500px; width: 1300px">
        <div class="info-container">
          <div class="left-left">
            <div>등기확인 HUG 인증여부</div>
            <br />
            <div>주소</div>
            <div>도로명 주소: {{ propInfo.roadName }} {{ propInfo.detailAddress }}</div>
            <div>
              지번 주소: {{ propInfo.address }}
              {{ propInfo.detailAddress }}
            </div>
            <br />
            <div>금액</div>
            <div>매매가: {{ propInfo.amount.toLocaleString() }} 원</div>
            <div>전세가: {{ propInfo.deposit.toLocaleString() }} 원</div>
            <br />
            <div>중개인의 한마디</div>
            <div class="agent-comment-box">
              {{ propInfo.description }}
            </div>
          </div>
          <div class="right-left">
            <div>{{ propInfo.imageUrl }}</div>
            <img src=
            https://zipkim-bucket.s3.ap-northeast-2.amazonaws.com/121d568b-9165-44f4-abb6-826bc6a4f506.png
            />
            <!-- 주소말고 변수로 어떻게 넣어야하는지? -->
            <!-- <img :src="imageUrl" /> -->
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
                <div>해당층 / 전체층</div>
                <div>방 / 욕실</div>
                <div>현관타입</div>
              </div>
              <div class="right-left">
                <div>아파트</div>
                <div>{{ propInfo.floor }} / {{ propInfo.totalFloor }}</div>
                <div>{{ propInfo.roomNo }} / {{ propInfo.bathNo }}</div>
                <div>{{ propInfo.porch }}</div>
              </div>
            </div>
          </div>
          <div class="right">
            <div class="info-container">
              <div class="left-left">
                <div>주차가능여부</div>
                <div>엘베유무</div>
                <div>주변정보</div>
              </div>
              <div class="right-left">
                <div>{{ propInfo.parking ? '가능' : '불가능' }}</div>
                <div>{{ propInfo.hasEv ? '있음' : '없음' }}</div>
                <div>
                  {{ propInfo.hasConvenience ? '편의점' : '' }}
                  {{ propInfo.hasSchool ? '학교' : '' }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <br />
        <br />
        <h4>[등기정보]</h4>
        <hr style="width: 100%; height: 4px; background-color: black" />
        <div>등기고유번호: {{ propInfo.uniqueNumber }}</div>
        <div>
          <!-- 코드정리하기 -->
          주의사항: {{ propInfo.attachMent1 ? '압류' : '' }}
          {{ propInfo.attachMent2 ? '가압류' : '' }} {{ propInfo.auction ? '경매개시결정' : '' }}
          {{ propInfo.trust ? '신탁' : '' }}
        </div>
        <div>근저당(총액): {{ propInfo.loan }} 원</div>
        <br />
        <br />
      </div>
    </div>
    <br />
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
  overflow-y: auto;
}
::-webkit-scrollbar {
  display: none;
}
.info-container {
  display: flex;
  justify-content: space-between;
}
.left,
.right {
  width: 48%;
}
.left-left,
.right-left {
  width: 48%;
}
.agent-comment-box {
  border: 1px solid #ccc;
  padding: 10px;
  height: 100px;
  margin-top: 10px;
  background: #f9f9f9;
}
</style>
