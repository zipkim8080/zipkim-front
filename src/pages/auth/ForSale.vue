<script setup>
import { defineEmits } from 'vue';
import axios from 'axios';
import { useLoginStore } from '@/stores/LoginStore.js';
import { ref } from 'vue';

const emit = defineEmits(['close']);

const LoginStore = useLoginStore();
const un = LoginStore.loadUsernameFromToken();

const list = ref([]);

const testss = async () => {
  try {
    const response = await axios.post('/apis/searchDB',{
      username:un, //유저 이름을 백엔드로 전송
    });
    list.value=response.data;
    console.log('Username : ', list.value);
  }catch (error) {
    console.log('Error fetch');
  }
};

const confirmDelete = (itemId) => {
  if (confirm('정말 삭제하겠습니까?')){
    deleteitem(itemId);
  }
};

const deleteitem = async (itemId) => {
  try {
    const response = await axios.delete(`/apis/items/${itemId}`);
    list.value = list.value.filter(item => item.id !== itemId);
  } catch (error) {

  }
};

const modify = async (itemId) => {
  const info = prompt("새로운 정보를 입력하세요 : ");
  if(!info){
    alert("모두 입력해야 합니다.");
    return;
  }
  try {
    const response = await axios.put(`/apis/items/modify/${itemId}`, {
      info:info
    });
    if(response.status === 200) {
      await testss();
    }
  }catch(error){

  }
}

const handleClose = () => {
  emit('close');
};
</script>

<template>
  <div class="title">
    <h1>내가 등록한 매물</h1>

    <!-- <button class="close-btn" @click="handleClose">
      <i class="fa-solid fa-x"></i>
    </button> -->
  </div>
  <div>
    <button class="close-btn" @click="testss">
      테스트3
    </button>
  </div>
  <div v-if="list.length > 0">
    <div v-for="(item, index) in list" :key="index" class="content-box">
      <div class="img">
        <img src="@/assets/images/img1.png" alt="매물 이미지" />
      </div>
      <div class="content">
        <div class="type">
          유형 : {{'오피스텔'}}
          <img class="check" src="@/assets/images/check.png" alt="체크 이미지"/>
        </div>
        <div class="price">
          가격 : {{item.id}}
        </div>
        <div class="where">
          위치 : {{item.check}}
        </div>
        <div class="word">
          설명 : {{item.detail}}
        </div>
        <button @click="confirmDelete(item.id)" class="delete-btn">X</button>
        <button @click="modify(item.id)" class="modify-btn">O</button>
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

.title {
  display: flex;
  justify-content: space-between;
  margin: 0;
}

.close-btn {
  border: none;
  background: none;
  margin-right: 10px;
  padding: 0px;
  cursor: pointer; /* 커서가 클릭 가능한 상태임을 표시 */
}

.close-btn i {
  font-size: 20px; /* 아이콘 크기 조정 */
}
</style>
