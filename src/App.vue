<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import Modal from '@/components/tool/Modal.vue';

const route = useRoute();

const isModalVisible = computed(() => route.name === 'SBInfo');
</script>

<template>
  <RouterView />
  <Modal v-if="isModalVisible">
    <router-view />
  </Modal>
</template>

<style scoped></style>
