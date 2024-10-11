<script setup>
import { defineEmits } from 'vue';
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useLoginStore } from '@/stores/LoginStore.js';
import PropertyDetails from "@/pages/side/PropertyDetails.vue";

const LoginStore = useLoginStore();
const un = LoginStore.loadUsernameFromToken();
const isModalOpen = ref(false);
const selectedPropertyId = ref(null);
const props = defineProps({
  propList: Object,
});

const openModal = (propertyId) => {
  selectedPropertyId.value = propertyId;
  isModalOpen.value = true;
}

const bookMarks = ref([]); //백엔드에서 내보내는 데이터를 저장

const emit = defineEmits(['close']);

const fetchBookMarks = async () => {
  try {
    const response = await axios.post('/apis/searchDB', {
      username: un, //유저 이름을 백엔드로 전송
    });
    bookMarks.value = response.data;
    console.log('Username : ', bookMarks.value);
  } catch (error) {
    if(error.response.status === 404) {
      console.log('데이터가 없습니다.');
    }
  }
};

defineExpose({ fetchBookMarks });


const handleClose = () => {
  emit('close');
};

const handleBookmarkClick = () => {
  fetchBookMarks();
  console.log('Username : ', bookMarks.value);
};

onMounted(() => {
  fetchBookMarks();
});
</script>

<template>

  <div v-if="bookMarks.length > 0">
    <div v-for="(bookMark, index) in bookMarks" :key="index" class="content-box">
      <div class="img">
        <img style="width: 200px; height: 130px; border-radius: 5px" :src="bookMark.image" />
      </div>
      <div class="content">
        <div class="type">
          유형 : {{'오피스텔'}}
          <img class="check" src="@/assets/images/check.png" alt="체크 이미지"/>
        </div>
        <div class="price">
           전세 {{bookMark.deposit}} 만원
        </div>
        <div class="info">
          매매 {{bookMark.amount}} 만원
        </div>
        <div class="word">
          {{bookMark.floor}} 층
        </div>
        <div>
          <button @click="openModal(bookMark.probid)">
            보러가기
          </button>
          <div v-if="isModalOpen" class="modal">
            <PropertyDetails :propId="selectedPropertyId" @close="isModalOpen = false"/>
          </div>
        </div>
    </div>
    </div>
  </div>
</template>

<style scoped>
.image-box {
  position: relative;
}

.bookMark-test {
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
.mark-nonChecked {
  position: absolute;
  left: 2px;
  top: 2px;
  border: none;
  background: rgba(0, 0, 0, 0);
  height: 10px;
  width: 10px;
  font-size: 24px;
}

.mark-checked {
  position: absolute;
  left: 2px;
  top: 2px;
  border: none;
  background: rgba(0, 0, 0, 0);
  color: #f3b706;
  height: 10px;
  width: 10px;
  font-size: 24px;
}

.content-box {
  padding: 15px 0px;
  display: flex;
  width: 400px;
  /* border-top: 0.5px solid #ccc; */
  border-bottom: 0.1px solid #ccc;
}

.check {
  height: 17px;
}

.price {
  /* font-size: 1.5rem; */
  font-size: 23px;
  font-weight: bold;
}

.where {
  font-size: 19px;
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
</style>
