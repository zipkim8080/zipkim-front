<template>
  <div id="map" class="kakao-map"></div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import { useKakaoMapStore } from '@/stores/KakaoMapStore';
import { useComplexesStore } from '@/stores/ComplexesStore';
import { useRouter } from 'vue-router';

const kakaoMapStore = useKakaoMapStore();
const complexesStore = useComplexesStore();
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
    center: new window.kakao.maps.LatLng(37.5480808046514, 127.06932600099586),
    level: 2,
  };

  map.value = new window.kakao.maps.Map(container, options);

  kakaoMapStore.setMap(map.value);

  // 처음 로드 시 API 호출하여 aptData를 가져옴
  complexesStore.getApt().then(() => {
    loadMarkers(); // 데이터를 가져온 후 마커를 그리기
  });

  getCenter();
}

// 지도 이동시 이동된 지도의 중심 좌표 전달
function getCenter() {
  window.kakao.maps.event.addListener(map.value, 'dragend', () => {
    const center = map.value.getCenter();
    const level = map.value.getLevel();
    const lat = center.getLat();
    const lng = center.getLng();
    console.log(`위도: ${lat} 경도: ${lng} 반경:${level}`);
    complexesStore.setLevel(level);
    complexesStore.setLat(lat);
    complexesStore.setLon(lng);
    complexesStore.getApt();
    loadMarkers();
  });
}

// 카카오맵 marker 불러오기 (이미지 설정)
function loadMarkers() {
  // const a = [
  //   { latitude: 37.548459, longitude: 127.069673 },
  //   { latitude: 37.54799, longitude: 127.068366 },
  // ];
  for (let i = 0; i < complexesStore.aptData.length; i++) {
    // for (let i = 0; i < a.length; i++) {
    const apt = complexesStore.aptData[i];
    // const apt = a[i];

    const markerPosition = new window.kakao.maps.LatLng(
      apt.latitude,
      apt.longitude
    );
    const imageSrc = '/images/property_gray.png'; // 이미지 주소
    const imageSize = new kakao.maps.Size(50, 50); // 이미지 크기
    const imageOption = { offset: new kakao.maps.Point(24, 60) }; // 마커와 이미지 위치 맞추기

    const markerImage = new window.kakao.maps.MarkerImage(
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
        apt.latitude, // 위도는 그대로 유지
        apt.longitude - 0.0012 // 경도를 조금 줄여서 왼쪽으로 중심 이동
      );
      map.value.panTo(markerMPosition);
      // 간략한 상세정보 주소이동(화면은 모달로 변경)
      router.push({ name: 'SBInfo' });
    });
  }
}

onMounted(() => {
  if (window.kakao && window.kakao.maps) {
    loadMap();
  } else {
    loadScript();
  }
});

watch(
  () => complexesStore.aptData,
  (newVal) => {
    if (Array.isArray(newVal) && newVal.length > 0) {
      loadMarkers();
    }
  },
  { immediate: true } // 처음 실행될 때도 동작
);
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
