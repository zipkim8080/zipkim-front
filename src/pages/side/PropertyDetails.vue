<script setup>
import axios from '@/api/index';
import { onMounted, reactive, ref, defineEmits, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import 'vue3-carousel/dist/carousel.css';
import { Carousel, Slide, Pagination, Navigation } from 'vue3-carousel';

import { useLoginStore } from '@/stores/LoginStore.js';

const LoginStore = useLoginStore();
const un = LoginStore.loadUsernameFromToken();
let isFavorite = ref(false);

const router = useRouter();
const route = useRoute();

const props = defineProps({
  propId: Number,
});
const emit = defineEmits(['close', 'bookMark']);

onMounted(async () => {
  try {
    await fetchPropertyData(props.propId);
    brokerData();
    check();
  } catch (error) {
    console.error('오류 발생:', error);
  }
});

const check = async () => {
  try {
    const response = await axios.get(`/api/bookmark/${props.propId}`);
    if (response.data == true) {
      isFavorite.value = true;
      console.log('즐겨찾기가 있습니다.');
    } else {
      isFavorite.value = false;
      console.log('즐겨찾기가 없습니다.');
    }
  } catch (error) {}
};

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
  brokerNo: '',
  name: '',
  companyName: '',
  phoneNumber: '',
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
    const response = await axios.get(`https://zipkimserver.store/api/prop/${propId}`);
    // console.log(response);
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
    propInfo.name = data.name;
    propInfo.brokerNo = data.brokerNo;
    propInfo.phoneNumber = data.phoneNumber;
    propInfo.complexId = data.complexId;
    propInfo.porch = data.porch;
    propInfo.registerId = data.registerId;
    propInfo.updatedAt = data.updatedAt;
    propInfo.description = data.description;
    propInfo.attachMent1 = data.register.attachment1;
    propInfo.attachMent2 = data.register.attachment2;
    propInfo.auction = data.register.auction;
    propInfo.trust = data.register.trust;
    propInfo.leaseAmount = data.register.leaseAmount;
    propInfo.uniqueNumber = data.register.uniqueNumber;
    propInfo.hugNumber = data.hugNumber;
    propInfo.loan = data.register.loan;
    propInfo.images = data.images;
    propInfo.register[0].openDate = data.register.openDate;
    console.log(propInfo);
    saveProperty(propInfo, propId);

    // console.log(propInfo);
  } catch (error) {
    console.error('Error fetching property data:', error);
  }
}

const saveProperty = (newPropInfo, propId) => {
  let existingProperties = JSON.parse(localStorage.getItem('propInfo')) || [];
  if (!Array.isArray(existingProperties)) {
    existingProperties = [];
  }
  newPropInfo.propId = propId;

  let index = -1;
  for (let i = 0; i < existingProperties.length; i++) {
    if (existingProperties[i].propId === newPropInfo.propId) {
      index = i;
      break;
    }
  }

  if (index !== -1) {
    existingProperties.splice(index, 1);
  }

  existingProperties.push(newPropInfo);
  if (existingProperties.length > 7) {
    existingProperties.shift();
  }
  localStorage.setItem('propInfo', JSON.stringify(existingProperties));
};

async function bookMark(id) {
  //이미 즐겨찾기 되있으면 해제
  if (isFavorite.value) {
    await axios.post('/api/bookmark/delete', {
      propertyId: id,
    });
    isFavorite.value = false;
  } //즐겨찾기 안되잇으면 즐찾
  else {
    await axios.post('/api/bookmark/add', {
      propertyId: id,
    });
    isFavorite.value = true;
  }
  emit('bookMark', { id: id, isFavorite: isFavorite.value });
}

async function brokerData() {
  try {
    // 요청 보낼 데이터 설정 propInfo.name,
    const requestBody = {
      name: propInfo.name,
      brokerNumber: propInfo.brokerNo,
    };
    const response = await axios.post('/api/broker', requestBody);
    const data = response.data;
    propInfo.companyName = data.companyName;
    propInfo.brokerNo = data.brokerNo;

    // console.log('응답 데이터:', propInfo.companyName);
  } catch (error) {
    console.error('요청 중 오류 발생:', error);
    // 에러 처리 로직 추가 가능
  }
}

const formattedOpenDate = computed(() => {
  if (!propInfo.register[0].openDate) return '';
  const openDate = propInfo.register[0].openDate;
  return openDate.replace(/(\d{4})년(\d{1,2})월(\d{1,2})일/, '$1년 $2월 $3일');
});
</script>

<template>
  <Teleport to="body">
    <div class="modal-backdrop">
      <div class="modal-container">
        <div class="modal-container3">
          <div style="margin: 20px">
            <button class="close-btn" @click="$emit('close')">
              <i class="fa-solid fa-x"></i>
            </button>
            <!--  -->

            <h4 style="font-weight: bold; text-align: center; margin-left: 6px; margin-top: 50px">
              {{ propInfo.roadName }}
              {{ propInfo.detailAddress }}
              <button @click="bookMark(propInfo.id)" class="bookMark-detail">
                <i :class="isFavorite ? 'fa-solid fa-heart' : 'fa-regular fa-heart'"></i>
              </button>
            </h4>
            <!-- <i class="fa-solid fa-hashtag mb-2"></i> &nbsp; 매물
              번호&nbsp;&nbsp; {{ propInfo.id }} -->
            <br />
            <br />
            <!-- 이미지 슬라이드 -->
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
            <br />
            <!-- 가격 -->
            <div style="display: flex">
              <div class="status-icon larger-text">매매</div>
              <div
                style="
                  font-weight: bold;
                  width: 168px;
                  text-align: right;
                  font-size: 21px;
                  padding-top: 4.5px;
                "
              >
                {{ propInfo.amount.toLocaleString() }} 만원
              </div>
            </div>
            <!--  -->
            <div style="display: flex">
              <div class="status-icon larger-text" style="font-weight: bold">전세</div>
              <div
                style="
                  font-weight: bold;
                  width: 168px;
                  text-align: right;
                  font-size: 21px;
                  padding-top: 4.5px;
                "
              >
                {{ propInfo.deposit.toLocaleString() }} 만원
              </div>
            </div>
            <br />
            <!--  -->
            <h5 style="font-weight: bold">중개인의 한마디</h5>
            <div class="agent-comment-box">
              {{ propInfo.description }}
            </div>
            <br />
            <br />

            <!--  -->
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
              <div class="prop-right">
                {{ propInfo.parking ? '가능' : '불가능' }}
              </div>
            </div>
            <hr class="section-divider" />
            <div class="info-container">
              <div class="prop-left">엘리베이터 유무</div>
              <div class="prop-right">
                {{ propInfo.hasEv ? '있음' : '없음' }}
              </div>
            </div>
            <hr class="section-divider" />
            <div class="info-container">
              <div class="prop-left">주변정보</div>
              <div class="prop-right">
                {{ propInfo.hasConvenience ? '편의점' : '' }}
                {{ propInfo.hasSchool ? '학교' : '' }}
              </div>
            </div>
            <hr class="section-divider" />
            <br />
            <br />
            <!--  -->
            <h5 style="font-weight: bold; margin-bottom: 10px">
              ✅ &nbsp; HUG 인증번호
              {{
                propInfo.hugNumber
                  ? `&nbsp;&nbsp;[&nbsp;${propInfo.hugNumber}&nbsp;]`
                  : '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-'
              }}
            </h5>
            <br />
            <br />
            <!--  -->
            <h5 style="font-weight: bold">등기정보</h5>
            <hr style="width: 100%; height: 3px; background-color: black" />
            <div class="info-container">
              <div class="prop-left">등기고유번호</div>
              <div class="prop-right">{{ propInfo.uniqueNumber }}</div>
            </div>
            <hr class="section-divider" />
            <div class="info-container">
              <div class="prop-left">열람일시</div>
              <div class="prop-right">{{ formattedOpenDate }}</div>
            </div>
            <hr class="section-divider" />
            <div class="info-container">
              <div class="prop-left">등기현황</div>
              <div class="info-container">
                <span class="status-item">압류&nbsp; {{ propInfo.attachMent1 ? '⭕' : '❌' }}</span>
                <span class="status-item"
                  >가압류&nbsp; {{ propInfo.attachMent2 ? '⭕️' : '❌' }}</span
                >
                <span class="status-item"
                  >경매개시결정&nbsp; {{ propInfo.auction ? '⭕️' : '❌' }}</span
                >
                <span class="status-item">신탁&nbsp; {{ propInfo.trust ? '⭕️' : '❌' }}</span>
              </div>
            </div>
            <hr class="section-divider" />
            <div class="info-container">
              <div class="prop-left">근저당(총액)</div>
              <div class="prop-right">
                {{ propInfo.loan > 0 ? propInfo.loan.toLocaleString() : 0 }} 원
              </div>
            </div>
            <hr class="section-divider" />
            <div class="info-container">
              <div class="prop-left">전세권(총액)</div>
              <div class="prop-right">
                {{ propInfo.leaseAmount > 0 ? propInfo.leaseAmount.toLocaleString() : 0 }} 원
              </div>
            </div>
            <hr class="section-divider" />
            <br />
            <br />
            <h5 style="font-weight: bold">중개사</h5>
            <hr style="width: 100%; height: 3px; background-color: black" />
            <div class="info-container">
              <div class="prop-left">사무소</div>
              <div class="prop-right">
                {{ propInfo.companyName }}
              </div>
            </div>
            <hr class="section-divider" />
            <div class="info-container">
              <div class="prop-left">중개인</div>
              <div class="prop-right">
                {{ propInfo.name }}
              </div>
            </div>
            <hr class="section-divider" />
            <div class="info-container">
              <div class="prop-left">중개사 번호</div>
              <div class="prop-right">{{ propInfo.brokerNo }}</div>
            </div>
            <hr class="section-divider" />
            <div class="info-container">
              <div class="prop-left">연락처</div>
              <div class="prop-right">
                {{
                  propInfo.phoneNumber
                    ? propInfo.phoneNumber.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3')
                    : '-'
                }}
              </div>
            </div>
            <hr class="section-divider" />
            <br />
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style>
.modal-container3 {
  position: absolute;
  background-color: white;
  border-radius: 7px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  width: 785px;
  height: 835px;
  z-index: 100;
  overflow: auto;
}

.modal-container {
  position: absolute;
  background-color: #ffecb3;
  border-radius: 7px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 807px;
  height: 857px;
  z-index: 100;
}

.wrapper {
  width: 745px;
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
  width: 745px;
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
  border-radius: 10px;
  border: 2px solid black;
  padding: 0 18px;
  margin: 5px 5px;
  font-weight: bold;
}

.larger-text {
  font-size: 18px;
  font-weight: bold;
}
</style>
