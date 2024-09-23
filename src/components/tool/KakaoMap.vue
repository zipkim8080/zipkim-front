<template>
  <div id="map" class="kakao-map"></div>
</template>

<script setup>
import { onMounted, onUnmounted, ref, defineExpose } from 'vue';
import { useKakaoMapStore } from '@/stores/KakaoMapStore';
import { useRouter } from 'vue-router';

const kakaoMapStore = useKakaoMapStore();
const router = useRouter();
const map = ref(null);
const marker = ref(null);

// 카카오맵 script 불러오기
function loadScript() {
  const script = document.createElement('script');
  script.src =
    '//dapi.kakao.com/v2/maps/sdk.js?appkey=7fa64a9f9df09bd4ad3bb3ad71e40379&autoload=false';
  script.onload = () => window.kakao.maps.load(loadMap);
  document.head.appendChild(script);
}

// 카카오맵 map 로드하기
function loadMap() {
  const container = document.getElementById('map');
  const options = {
    center: new window.kakao.maps.LatLng(37.548138, 127.073397),
    level: 2,
  };

  map.value = new window.kakao.maps.Map(container, options);

  kakaoMapStore.setMap(map.value);

  getCenter();
  loadMarker();
}

// 카카오맵 marker 불러오기 (이미지 설정)
function loadMarker() {
  const markerPosition = new window.kakao.maps.LatLng(37.548138, 127.073397);
  const imageSrc = 'public/images/property_gray.png'; // 이미지 주소
  const imageSize = new kakao.maps.Size(50, 50); // 이미지 크기
  const imageOption = { offset: new kakao.maps.Point(24, 60) }; // 마커와 이미지 위치 맞추기
  const markerImage = new kakao.maps.MarkerImage(
    imageSrc,
    imageSize,
    imageOption
  );

  const marker = new window.kakao.maps.Marker({
    position: markerPosition,
    image: markerImage,
  });

  marker.setMap(map.value);

  // 마커에 클릭 이벤트 설정하기
  window.kakao.maps.event.addListener(marker, 'click', function () {
    const markerMPosition = new window.kakao.maps.LatLng(
      37.548138, // 위도는 그대로 유지
      127.073397 - 0.0012 // 경도를 조금 줄여서 왼쪽으로 중심 이동
    );
    map.value.panTo(markerMPosition);
    // 간략한 상세정보 주소이동(화면은 모달로 변경)
    router.push({ name: 'SBInfo' });
  });
}

// 지도 이동시 이동된 지도의 중심 좌표 전달
function getCenter() {
  window.kakao.maps.event.addListener(map.value, 'dragend', function () {
    const center = map.value.getCenter();
    const level = map.value.getLevel();
    const lat = center.getLat();
    const lng = center.getLng();
    console.log(`위도: ${lat} 경도: ${lng} 반경:${level}`);
  });
}

onMounted(() => {
  if (window.kakao && window.kakao.maps) {
    loadMap();
  } else {
    loadScript();
  }
});

// onUnmounted(() => {
//   // 필요한 경우 cleanup 코드 추가
// });
</script>

<style scoped>
#map {
  width: 100%;
  height: 100vh;
}
.kakao-map {
  width: 100%;
  height: 100vh;
  z-index: 1;
}
</style>
