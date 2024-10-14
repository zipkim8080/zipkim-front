<script setup>
import { defineEmits } from 'vue';

const emit = defineEmits(['close']);

const handleClose = () => {
  emit('close');
};
</script>

<template>
  <div class="box">
    <div class="title">
      <h4 class="login-title">집킴이 개인정보 처리방침</h4>
      <div>
        <button class="close-btn" @click="handleClose">
          <i class="fa-solid fa-x"></i>
        </button>
      </div>
    </div>
    <div class="information">
      <div>※ 개정일: 2024년 09월 05일</div>
      <hr />
      <div class="container">
        집킴이가 운영하는 「집킴이」는 정보주체의 자유와 권리 보호를 위해 「개인정보 보호법」 및
        관계 법령이 정한 바를 준수하여, 적법하게 개인정보를 처리하고 안전하게 관리하고 있습니다.
        이에 「개인정보 보호법」 제30조에 따라 정보주체에게 개인정보 처리와 보호에 관한 절차 및
        기준을 안내하고, 이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 하기 위하여 다음과
        같이 개인정보 처리방침을 수립·공개합니다.
      </div>
      <hr />
    </div>
  </div>
</template>

<style scoped>
.box {
  width: 100%;
  max-width: 500px;
  /* border: 1px solid #ddd; */
  border-radius: 8px;
  overflow: hidden;
}

.title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 32px 10px 0px;
  position: sticky;
  z-index: 1;
}

.login-title {
  margin: 0;
  font-size: 22px;
  font-weight: bold;
}

.close-btn {
  position: absolute;
  top: 10px;
  right: -10px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
}

.information {
  padding: 16px;
  max-height: 300px; /* 본문 내용이 넘칠 경우 스크롤 생김 */
  overflow-y: auto;
}

.container {
  line-height: 1.6;
  color: #333;
}
</style>
