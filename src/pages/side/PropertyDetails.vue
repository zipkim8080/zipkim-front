<script setup>
import axios from 'axios';
import { onMounted, reactive } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import 'vue3-carousel/dist/carousel.css';
import { Carousel, Slide, Pagination, Navigation } from 'vue3-carousel';

const router = useRouter();
const route = useRoute();

const props = defineProps({
  propId: String,
});

onMounted(() => {
  fetchPropertyData(props.propId);
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
      leaseAmount: 0,
      loan: 0,
      uniqueNumber: '',
      openDate: '', // 열람일시
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
    propInfo.hugNumber = data.hugNumber;
    propInfo.loan = data.register.loan;
    propInfo.images = data.images;
    propInfo.register[0].openDate = data.register.openDate;
    console.log(propInfo);
  } catch (error) {
    console.error('Error fetching property data:', error);
  }
}
</script>

<template>
  <Teleport to="body">
    <div class="modal-backdrop">
      <div class="modal-container">
        <button class="close-btn" @click="$emit('close')">
          <i class="fa-solid fa-x"></i>
        </button>
        <div class="mt-2 mx-auto" style="height: 800px; width: 800px">
          <h6 style="font-weight: bold">
            ✅ &nbsp; HUG 인증번호
            {{
              propInfo.hugNumber
                ? `&nbsp;&nbsp;[&nbsp;${propInfo.hugNumber}&nbsp;]`
                : '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-'
            }}
          </h6>
          <br />
          <h6 style="font-weight: bold">{{ propInfo.roadName }} {{ propInfo.detailAddress }}</h6>
          <br />
          <h6 style="font-weight: bold">
            <span class="status-icon" style="font-weight: bold">BUY</span>&nbsp;
            {{ propInfo.amount.toLocaleString() }} 만원
          </h6>
          <h6 style="font-weight: bold">
            <span class="status-icon">RENT</span>&nbsp; {{ propInfo.deposit.toLocaleString() }} 만원
          </h6>

          <br />
          <h6 style="font-weight: bold">중개인의 한마디</h6>
          <div class="agent-comment-box">
            {{ propInfo.description }}
          </div>
          <br />
          <br />
          <div class="wrapper">
            <Carousel :autoplay="3000" :wrap-around="true">
              <Slide v-for="(image, index) in propInfo.images" :key="index">
                <div class="carousel__item">
                  <img class="slideImg" :src="image.imageUrl" width="600px" height="400px" />
                </div>
              </Slide>
              <template #addons>
                <Pagination />
                <Navigation />
              </template>
            </Carousel>
          </div>
        </div>
        <br />
        <br />
        <h5 style="font-weight: bold">매물정보</h5>
        <hr style="width: 100%; height: 3px; background-color: black" />
        <div class="info-container">
          <div class="prop-left">해당층 / 전체층</div>
          <div class="prop-right">{{ propInfo.floor }} / {{ propInfo.totalFloor }}</div>
        </div>
        <hr class="section-divider" />
        <div class="info-container">
          <div class="prop-left">방 / 욕실</div>
          <div class="prop-right">{{ propInfo.roomNo }} / {{ propInfo.bathNo }}</div>
        </div>
        <hr class="section-divider" />
        <div class="info-container">
          <div class="prop-left">현관타입</div>
          <div class="prop-right">{{ propInfo.porch }}</div>
        </div>
        <hr class="section-divider" />
        <div class="info-container">
          <div class="prop-left">주차가능 여부</div>
          <div class="prop-right">{{ propInfo.parking ? '가능' : '불가능' }}</div>
        </div>
        <hr class="section-divider" />
        <div class="info-container">
          <div class="prop-left">엘리베이터 유무</div>
          <div class="prop-right">{{ propInfo.hasEv ? '가능' : '불가능' }}</div>
        </div>
        <hr class="section-divider" />
        <div class="info-container">
          <div class="prop-left">주변정보</div>
          <div class="prop-right">
            {{ propInfo.hasConvenience ? '편의점' : '' }} {{ propInfo.hasSchool ? '학교' : '' }}
          </div>
        </div>
        <hr class="section-divider" />
        <br />
        <br />
        <h5 style="font-weight: bold">등기정보</h5>
        <hr style="width: 100%; height: 4px; background-color: black" />
        <div class="info-container">
          <div class="prop-left">등기고유번호</div>
          <div class="prop-right">{{ propInfo.uniqueNumber }}</div>
        </div>
        <hr class="section-divider" />
        <div class="info-container">
          <div class="prop-left">열람일시</div>
          <div class="prop-right">{{ propInfo.register[0].openDate }}</div>
        </div>
        <hr class="section-divider" />
        <div class="info-container">
          <div class="prop-left">등기현황</div>
          <div class="info-container">
            <span class="status-item">압류&nbsp; {{ propInfo.attachMent1 ? '⭕' : '❌' }}</span>
            <span class="status-item">가압류&nbsp; {{ propInfo.attachMent2 ? '⭕️' : '❌' }}</span>
            <span class="status-item"
              >경매개시결정&nbsp; {{ propInfo.auction ? '⭕️' : '❌' }}</span
            >
            <span class="status-item">신탁&nbsp; {{ propInfo.trust ? '⭕️' : '❌' }}</span>
          </div>
        </div>
        <hr class="section-divider" />
        <div class="info-container">
          <div class="prop-left">근저당(총액)</div>
          <div class="prop-right">{{ propInfo.loan }} 원</div>
        </div>
        <hr class="section-divider" />
        <div class="info-container">
          <div class="prop-left">전세권(총액)</div>
          <div class="prop-right">{{ propInfo.leaseAmount }} 원</div>
        </div>
        <hr class="section-divider" />
        <br />
      </div>
    </div>
  </Teleport>
</template>

<style>
.modal-backdrop2 {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
}
.modal-container {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 3%;
  border-radius: 10px;
  z-index: 1001;
  box-shadow: rgba(0, 0, 0, 0.2);
  overflow-y: auto;
  height: 83%;
}
::-webkit-scrollbar {
  display: none;
}
.close-btn {
  border: none;
  background: none;
  position: absolute;
  top: 20px;
  right: 20px;
  padding: 0;
}
.agent-comment-box {
  border: 1px solid #ccc;
  padding: 10px;
  height: 100px;
  margin-top: 10px;
  background: #f9f9f9;
  border-radius: 10px;
}
.info-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
.left-align {
  text-align: left;
  flex: 1;
}
.right-align {
  text-align: right;
  flex: 1;
}
.section-divider {
  width: 100%;
  height: 0.5px;
  background-color: rgb(130, 127, 127);
  border: none;
  margin-top: 1px;
}
.status-item {
  margin-right: 10px;
  background-color: #f4f4f4;
  border-radius: 5px;
  padding: 4px 10px;
}
.status-item:last-child {
  margin-right: 0;
}
.divider {
  margin: 0 15px;
}
.status-icon {
  display: inline-block;
  background-color: white;
  border-radius: 10px;
  border: 2px solid black;
  padding: 2px 4px;
  font-weight: bold;
  font-size: 12px;
  margin-right: 5px;
}
</style>
