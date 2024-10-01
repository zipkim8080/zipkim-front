<script setup>
import { ref } from 'vue';
import PropertyDetails from '@/pages/side/PropertyDetails.vue';

const isModalOpen = ref(false);

const openModal = () => {
  isModalOpen.value = true;
};
</script>

<template>
  <div>
    <div @click="openModal">매물 리스트</div>
    <div v-if="isModalOpen" @close="isModalOpen = false">
      <PropertyDetails />
    </div>
  </div>
</template>

<style scoped></style>
