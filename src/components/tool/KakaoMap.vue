<template>
  <div id="map"></div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue';
import { ref } from 'vue';

const map = ref(null);

function loadScript() {
  const script = document.createElement('script');
  script.src =
    '//dapi.kakao.com/v2/maps/sdk.js?appkey=7fa64a9f9df09bd4ad3bb3ad71e40379&autoload=false';
  script.onload = () => window.kakao.maps.load(loadMap);
  document.head.appendChild(script);
}

function loadMap() {
  const container = document.getElementById('map');
  const options = {
    center: new window.kakao.maps.LatLng(37.548138, 127.073397),
    level: 2,
  };

  map.value = new window.kakao.maps.Map(container, options);
  loadMarker();
}

function loadMarker() {
  const markerPosition = new window.kakao.maps.LatLng(37.548138, 127.073397);
  const marker = new window.kakao.maps.Marker({
    position: markerPosition,
  });

  marker.setMap(map.value);
}

onMounted(() => {
  if (window.kakao && window.kakao.maps) {
    loadMap();
  } else {
    loadScript();
  }
});

onUnmounted(() => {
  // 필요한 경우 cleanup 코드 추가
});
</script>

<style scoped>
#map {
  width: 100%;
  height: 919px;
}
</style>
