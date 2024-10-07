<script setup>
import { ref, defineProps, onMounted, watch, reactive } from 'vue';
import PropertyDetails from '@/pages/side/PropertyDetails.vue';
import axios from 'axios';
const isModalOpen = ref(false);
const selectedPropertyId = ref(null);
const props = defineProps({
  propList: Object,
});
const openModal = (propertyId) => {
  selectedPropertyId.value = propertyId; // 선택된 아이템의 ID를 설정합니다.
  isModalOpen.value = true;
};
</script>

<template>
  <div class="list">
    <div
      class="content-box"
      v-for="(property, index) in propList.items"
      :key="property.id"
      @click="openModal(property.id)"
    >
      <div class="img">
        <img style="width: 230px; height: 100%" :src="property.imageUrl" />
      </div>
      <div class="content">
        <div class="type">
          {{ property.type }}
          <img class="check" src="@/assets/images/check.png" />
        </div>
        <div class="price">전세 {{ property.deposit.toLocaleString() }}</div>
        <div class="price">매매 {{ property.amount.toLocaleString() }}</div>
        <div class="where">{{ property.complexName }}</div>
        <div class="info">{{ property.floor }}층</div>
      </div>
    </div>
  </div>
  <div v-if="isModalOpen" @close="isModalOpen = false">
    <PropertyDetails :propId="selectedPropertyId" @close="isModalOpen = false" />
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
  font-size: 20px;
  font-weight: bold;
}

.where {
  font-size: 17px;
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
