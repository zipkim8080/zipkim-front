<script setup>
import { defineEmits } from 'vue';
import { ref, onMounted } from "vue";
import axios from 'axios';
import { useLoginStore } from "@/stores/LoginStore.js";

const LoginStore = useLoginStore();
const un = LoginStore.loadUsernameFromToken();

const bookMarks = ref([]); //백엔드에서 내보내는 데이터를 저장

const emit = defineEmits(['close']);

const fetchBookMarks = async () => {
  try {
    const response = await axios.post('/api/searchDB',{
      username:un, //유저 이름을 백엔드로 전송
    });
    bookMarks.value=response.data;
    console.log('Username : ', bookMarks.value);
  }catch (error) {
    console.log('Error fetch');
  }
};

defineExpose({fetchBookMarks});

const handleClose = () => {
  emit('close');
};

const handleBookmarkClick = () => {
    fetchBookMarks();
    console.log('Username : ', bookMarks.value);
  }

onMounted(() => {
  fetchBookMarks();
});

</script>

<template>
  <div class="title">
    <h1>즐겨찾기</h1>
    <button class="close-btn" @click="handleClose">
      <i class="fa-solid fa-x"></i>
    </button>
  </div>

  <div v-if="bookMarks.length > 0">
    <div v-for="(bookMark, index) in bookMarks" :key="index">
      <p>이름 : {{ bookMark.username }}</p>
      <p>전화번호 : {{ bookMark.phonenumber}}</p>
    </div>
    <!-- 나중에 즐겨찾기 리스트에서 쭉 뽑아올 예정 -->
    <div class="list">
      <div class="content-box">
        <div class="img">
          <img src="@/assets/images/img1.png" />
        </div>
        <div class="content">
          <div class="type">
            오피스텔
            <img class="check" src="@/assets/images/check.png" />
          </div>
          <div class="price">전세 1.5억</div>
          <div class="where">공항동 · 해태</div>
          <div class="info">33m<sup>2</sup> · 7층</div>
          <div class="word">역세권 5분 뛰면 1분</div>
        </div>
      </div>
      <div class="content-box">
        <div class="img">
          <img src="@/assets/images/img2.png" />
        </div>
        <div class="content">
          <div class="type">아파트</div>
          <div class="price">매매 4억</div>
          <div class="where">광안동 · 스카이뷰</div>
          <div class="info">84m<sup>2</sup> · 11층</div>
          <div class="word">근처에 학교가 많아요</div>
        </div>
      </div>
      <div class="content-box">
        <div class="img">
          <img src="@/assets/images/img3.png" />
        </div>
        <div class="content">
          <div class="type">원룸</div>
          <div class="price">매매 2억</div>
          <div class="where">공항동 · 해태</div>
          <div class="info">54m<sup>2</sup> · 2층</div>
          <div class="word">역세권 3분 뛰면 30초</div>
        </div>
      </div>
      <div class="content-box">
        <div class="img">
          <img src="@/assets/images/img4.png" />
        </div>
        <div class="content">
          <div class="type">원룸</div>
          <div class="price">전세 1억</div>
          <div class="where">공항동 · 해태</div>
          <div class="info">39m<sup>2</sup> · 1층</div>
          <div class="word">역세권 5분</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.content-box {
  padding: 15px 0px;
  display: flex;
  width: 400px;
  border-top: 0.5px solid #ccc;
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
