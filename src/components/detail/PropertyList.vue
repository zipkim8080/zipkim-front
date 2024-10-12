<script setup>
import { ref, defineProps, onMounted, watch, reactive } from 'vue';
import PropertyDetails from '@/pages/side/PropertyDetails.vue';
import axios from 'axios';
import { useLoginStore } from '@/stores/LoginStore.js';

const loginStore = useLoginStore();
const un = loginStore.loadUsernameFromToken();
const isModalOpen = ref(false);
const selectedPropertyId = ref(null);
const props = defineProps({
  propList: Object,
});

const openModal = (propertyId) => {
  selectedPropertyId.value = propertyId; // 선택된 아이템의 ID를 설정합니다.
  isModalOpen.value = true;
};
// 건물 유형 한글 변환
function invertToKR(type) {
  let kr = type;
  if (kr === 'apt') {
    kr = '아파트';
  } else if (kr === 'opi') {
    kr = '오피스텔';
  } else if (kr === 'dd') {
    kr = '단독다가구';
  } else if (kr === 'yr') {
    kr = '연립다세대';
  }
  return kr;
}

// 상세페이지에서 좋아요버튼눌렸을때 리스트에도 반영
const handleBookMarkEvent = ({ id, isFavorite }) => {
  console.log('이벤트왓어요' + id, isFavorite);
  const property = props.propList.items.find((p) => p.id == id);
  property.isFavorite = isFavorite;
  // property.isFavorite = status;
  console.log(property);
};

async function bookMark(property) {
  //이미 즐겨찾기 되있으면 해제
  if (property.isFavorite) {
    await axios.post('https://zipkimserver.store/api/bookmark/delete', {
      propertyId: property.id,
    });
    property.isFavorite = false;
    // status = false;
  } //즐겨찾기 안되잇으면 즐찾
  else {
    await axios.post('https://zipkimserver.store/api/bookmark/add', {
      propertyId: property.id,
    });
    property.isFavorite = true;
    // status = true;
  }
  // return status;
}
</script>

<template>
  <div class="list">
    <div class="content-box" v-for="(property, index) in propList.items" :key="property.id">
      <div class="image-box">
        <div class="img">
          <img style="width: 200px; height: 130px; border-radius: 5px" :src="property.imageUrl" />
        </div>
        <button @click="bookMark(property)" class="mark-checked">
          <i :class="property.isFavorite ? 'fa-solid fa-heart' : 'fa-regular fa-heart'
            "></i>
        </button>
      </div>

      <div class="content" @click="openModal(property.id)">
        <div class="type">
          {{ invertToKR(property.type) }}
          <img v-if="property.hugNumber" class="check" src="@/assets/images/check.png" />
        </div>
        <div class="price">
          매매 {{ property.amount.toLocaleString() }} 만원
        </div>
        <div class="price">
          전세 {{ property.deposit.toLocaleString() }} 만원
        </div>
        <div class="where">
          {{ property.complexName
          }}<span class="info m-1"> {{ property.floor }}층</span>
        </div>
      </div>
    </div>
  </div>
  <div v-if="isModalOpen" @close="isModalOpen = false">
    <PropertyDetails @bookMark="handleBookMarkEvent" :propId="selectedPropertyId" @close="isModalOpen = false" />
  </div>
</template>

<style scoped>
.content-box {
  padding: 15px 0px;
  display: flex;
  width: 400px;
  border-bottom: 0.1px solid #ccc;
}

.check {
  height: 17px;
}

.price {
  /* font-size: 1.5rem; */
  font-size: 18px;
  font-weight: bold;
}

.where {
  font-size: 16px;
}

.word {
  color: #7f7e7e;
}

.content {
  margin-left: 15px;
}

.title {
  display: flex;
  justify-content: space-between;
}

.close-btn {
  border: none;
  background: none;
  margin-right: 20px;
  padding: 0px;
}

.outer {
  display: flex;
  justify-content: center;
  align-items: center;
}

.image-box {
  position: relative;
}

.mark-checked {
  position: absolute;
  left: 2px;
  top: 2px;
  border: none;
  background: rgba(0, 0, 0, 0);
  color: rgb(246, 60, 74);
  height: 10px;
  width: 10px;
  font-size: 24px;
}
</style>
