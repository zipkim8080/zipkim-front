<script setup>
import { defineEmits } from 'vue';

const emit = defineEmits(['close']);

const handleClose = () => {
  emit('close');
};
</script>

<template>
  <div class="title">
    <!-- 나중에 즐겨찾기 리스트에서 쭉 뽑아올 예정 -->
    <div class="list">
      <div class="content-box">
        <div class="img">
          <img src="@/assets/images/img1.png" />
        </div>
        <div class="content">
          <div class="price">매매 5억</div>
          <div class="where">공항동 · 해태</div>
          <div class="info">112/84m<sup>2</sup></div>
          <div class="word">역세권 5분</div>
        </div>
      </div>
      <div class="content-box">
        <div class="img">
          <img src="@/assets/images/img2.png" />
        </div>
        <div class="content">
          <div class="price">매매 5억</div>
          <div class="where">공항동 · 해태</div>
          <div class="info">112/84m<sup>2</sup></div>
          <div class="word">역세권 5분</div>
        </div>
      </div>
      <div class="content-box">
        <div class="img">
          <img src="@/assets/images/img3.png" />
        </div>
        <div class="content">
          <div class="price">매매 5억</div>
          <div class="where">공항동 · 해태</div>
          <div class="info">112/84m<sup>2</sup></div>
          <div class="word">역세권 5분</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.content-box {
  padding: 5px;
  display: flex;
  border-top: 0.5px solid #ccc;
  border-bottom: 0.1px solid #ccc;
}

.content {
  margin-left: 10px;
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
