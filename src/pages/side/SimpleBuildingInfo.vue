<script setup></script>

<template>
  <div class="cInfo-overlay">
    <h1 class="text text-center">간략한 건물정보</h1>
    <ProductList />
  </div>
</template>

<style scope>
.cInfo-overlay {
  position: absolute;
  top: 168px;
  left: 20px;
  z-index: 10;
  background-color: rgb(230, 240, 233);
  padding: 10px;
  border-radius: 5px;
  width: 478px;
  height: 700px;
}
</style>
