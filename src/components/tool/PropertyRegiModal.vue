<template>
  <div class="propertyRegi-modal-back"></div>
  <div class="propertyRegi-modal"></div>
  <div class="propertyRegi-modal2">
    <AddProperty />
  </div>
</template>

<script setup>
import SBInfo from '@/pages/side/SimpleBuildingInfo.vue';
import AddProperty from '@/pages/AddProperty.vue';
</script>

<style scoped>
.propertyRegi-modal {
  position: absolute;
  background-color: #ffecb3;
  border-radius: 7px;
  top: 2%;
  left: 29.3%;
  width: 807px;
  height: 860px;
  z-index: 100;
}
.propertyRegi-modal2 {
  position: absolute;
  background-color: white;
  border-radius: 7px;
  top: 3.3%;
  left: 30%;
  width: 785px;
  height: 835px;
  z-index: 100;
}
.propertyRegi-modal-back {
  position: absolute;
  background-color: rgba(0, 0, 0, 0.5);
  top: 0%;
  left: 0%;
  width: 100%;
  height: 100%;
  z-index: 100;
}
</style>
