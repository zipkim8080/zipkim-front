<script setup>
import { defineEmits } from 'vue';
import axios from 'axios';
import { useLoginStore } from '@/stores/LoginStore.js';
import { ref, onMounted } from 'vue';
import PropertyDetails from "@/pages/side/PropertyDetails.vue";

const emit = defineEmits(['close']);

const LoginStore = useLoginStore();
const un = LoginStore.loadUsernameFromToken();

const list = ref([]);

const testss = async (brokerid) => {
  try {
    const response = await axios.get(`/api/prop/${brokerid}`);
    list.value = response.data;
    console.log(list.value);
  }catch (error) {
    console.log('Error fetch');
  }
};

const handleClose = () => {
  emit('close');
};

onMounted(() => {
});

</script>

<template>
  <div class="title">
    <h1>내가 등록한 매물</h1>
  </div>
  <div v-if="list.length > 0">
    <div v-for="(lists, index) in list" :key="index" class="content-box">
      <div class="img">
        <img style="width: 200px; height: 130px; border-radius: 5px" :src="lists.image" />
      </div>
      <div class="content">
        <div class="type">
          {{'apt'}}
          <img class="check" src="@/assets/images/check.png" alt="체크 이미지"/>
        </div>
        <div class="price">
          전세 {{lists.deposit}} 만원
        </div>
        <div class="info">
          매매 {{lists.amount}} 만원
        </div>
        <div class="word">
          {{lists.floor}} 층
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
