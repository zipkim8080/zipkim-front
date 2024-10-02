<script setup>
import { ref, defineProps, onMounted, watch, reactive } from 'vue';
import PropertyDetails from '@/pages/side/PropertyDetails.vue';
import axios from 'axios';
const isModalOpen = ref(false);
const props = defineProps({
  propList: Array,
});
const openModal = () => {
  isModalOpen.value = true;
};

</script>

<template>
  <div>
    <div v-for="(property, index) in propList" :key="index">
      <p>매매가: {{ property.amount }}</p>
      <p>전세가: {{ property.deposit }}</p>
      <p>설명: {{ property.description }}</p>
      <p>상세주소: {{ property.detailAddress }}</p>
      <p>층: {{ property.floor }}</p>
      <p>매물id: {{ property.id }}</p>
      <img :src="property.imageUrl" />
      <div>--------------------------------------</div>
    </div>
    <div v-if="isModalOpen" @click="openModal" @close="isModalOpen = false">
      <PropertyDetails />
    </div>
  </div>
</template>

<style scoped></style>
