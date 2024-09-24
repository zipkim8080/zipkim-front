<template>
  <div class="input-group mb-3">
    <img src="@\assets\images\zipkimLogo.png" class="imgSize" />
    <input
      type="text"
      class="form-control"
      placeholder="아파트 또는 지역명으로 검색"
      aria-label="Recipient's username"
      aria-describedby="button-addon2"
    />
    <button class="btn btn-outline-success" type="button" id="button-addon2">
      <i class="fa-solid fa-magnifying-glass"></i>
    </button>
  </div>
  <div>
    <button class="btn btn-success btn-lg me-2">아파트</button
    ><button class="btn btn-success btn-lg me-2">오피스텔</button
    ><button class="btn btn-success btn-lg me-2">단독다가구</button
    ><button class="btn btn-success btn-lg">연립다세대</button>
  </div>
</template>
<script setup></script>
<style scope>
.imgSize {
  width: 50px;
  height: 50px;
  margin-top: 5px;
  margin-bottom: 3px;
  margin-right: 10px;
  margin-left: 4px;
}
.search-overlay {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 10;
  background-color: rgb(230, 240, 233);
  padding: 10px;
  border-radius: 5px;
}
</style>
