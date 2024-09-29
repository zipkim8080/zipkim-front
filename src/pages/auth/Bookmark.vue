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
