<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import Modal from '@/components/tool/Modal.vue';
import PRModal from '@/components/tool/PropertyRegiModal.vue';
const route = useRoute();

const isModalVisible = computed(() => route.name === 'SBInfo');
const isModalVisible2 = computed(() => route.name === 'AddProperty');
</script>

<template>
  <RouterView />
  <transition name="fade">
    <PRModal v-if="isModalVisible2" />
  </transition>
  <transition name="fade">
    <Modal v-if="isModalVisible" />
  </transition>
</template>

<style scoped></style>
