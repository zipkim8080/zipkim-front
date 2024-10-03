<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import Modal from '@/components/tool/Modal.vue';
import PRModal from '@/components/tool/propertyRegiModal.vue';
const route = useRoute();

const isModalVisible = computed(() => route.name === 'SBInfo');
const isModalVisible2 = computed(() => route.name === 'AddProperty');
</script>

<template>
  <RouterView />
  <PRModal v-if="isModalVisible2" />
  <Modal v-if="isModalVisible">
    <router-view />
  </Modal>
</template>

<style scoped></style>
