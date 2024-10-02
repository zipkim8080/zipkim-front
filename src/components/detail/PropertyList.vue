<script setup>
import { ref, defineProps } from 'vue';
import PropertyDetails from '@/pages/side/PropertyDetails.vue';

const isModalOpen = ref(false);
const props = defineProps({
  complexId: String,
});
const openModal = () => {
  isModalOpen.value = true;
};
</script>

<template>
  <div>
    <span @click="openModal">{{ complexId }}</span>
    <div v-if="isModalOpen" @click="openModal" @close="isModalOpen = false">
      <PropertyDetails />
    </div>
  </div>
</template>

<style scoped></style>
