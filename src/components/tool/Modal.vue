<template>
  <div class="sidebar-modal">
    <div class="sidebar-content">
      <SBInfo />
    </div>
  </div>
</template>

<script setup>
import SBInfo from '@/pages/side/SimpleBuildingInfo.vue';
</script>

<style scoped>
.sidebar-modal {
  position: fixed;
  top: 0;
  left: 0; /* 사이드바가 오른쪽에 고정되도록 */
  z-index: 100;
  flex-direction: column;
  padding: 20px;
}

.sidebar-content {
  flex-grow: 1;
}
</style>
