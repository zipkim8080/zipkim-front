<template>
  <div id="map" class="kakao-map"></div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useKakaoMapStore } from '@/stores/KakaoMapStore';
import { useComplexesStore } from '@/stores/ComplexesStore';
import { useRouter } from 'vue-router';

const router = useRouter();
const kakaoMapStore = useKakaoMapStore();
const complexesStore = useComplexesStore();
const map = ref(null);

// 카카오맵 script 불러오기
function loadScript() {
  const script = document.createElement('script');
  script.src =
    '//dapi.kakao.com/v2/maps/sdk.js?appkey=7fa64a9f9df09bd4ad3bb3ad71e40379&autoload=false';
  script.onload = () => window.kakao.maps.load(loadMap);
  document.head.appendChild(script);
}

// 카카오맵 map 로드하기
async function loadMap() {
  const container = document.getElementById('map');
  const options = {
    center: new window.kakao.maps.LatLng(37.548138, 127.073397),
    level: 2,
  };

  map.value = new window.kakao.maps.Map(container, options);

  kakaoMapStore.setMap(map.value);

  await complexesStore.getApi();
  complexesStore.loadMarkers(router); // 마커 로드

  let timeoutId = null;
  let firstLoad = true; // 첫 화면인지 여부를 확인하는 변수

  async function fetchAptData() {
    const center = map.value.getCenter();
    const level = map.value.getLevel();
    const lat = center.getLat();
    const lng = center.getLng();
    complexesStore.setLevel(level);
    complexesStore.setLat(lat);
    complexesStore.setLon(lng);

    await complexesStore.getApi(); // API 호출
    complexesStore.loadMarkers(router); // 마커 로드
    complexesStore.xxDongApi();
  }

  // 첫 화면 로드 시 바로 호출
  fetchAptData();

  // 지도 이동이나 확대/축소 시 일정 시간 후에 다시 API 호출
  kakao.maps.event.addListener(map.value, 'idle', function () {
    fetchAptData(); // API 호출 및 마커 로드
  });
}

onMounted(() => {
  if (window.kakao && window.kakao.maps) {
    loadMap();

    // 맵 밖 마커 및 오버레이 삭제
    kakao.maps.event.addListener(
      map.value,
      'bounds_changed',
      complexesStore.removeOutOfBoundsMarkersAndOverlays
    );
  } else {
    loadScript();
  }
});
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
