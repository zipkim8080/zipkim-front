<template>
  <div class="propertyRegi-modal-back">
    <div class="propertyRegi-modal">
      <div class="propertyRegi-modal2">
        <AddProperty />
      </div>
    </div>
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
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 807px;
  height: 857px;
  z-index: 100;
}
.propertyRegi-modal2 {
  position: absolute;
  background-color: white;
  border-radius: 7px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
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
