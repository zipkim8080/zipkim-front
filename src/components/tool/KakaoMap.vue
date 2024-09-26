<template>
  <div id="map" class="kakao-map"></div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
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
async function loadMap() {
  const container = document.getElementById('map');
  const options = {
    center: new window.kakao.maps.LatLng(37.548138, 127.073397),
    level: 2,
  };

  map.value = new window.kakao.maps.Map(container, options);

  kakaoMapStore.setMap(map.value);

  await complexesStore.getApt();

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

    await complexesStore.getApt(); // API 호출
    loadMarkers(); // 마커 로드
  }

  // 첫 화면 로드 시 바로 호출
  fetchAptData();

  // 지도 이동이나 확대/축소 시 일정 시간 후에 다시 API 호출
  kakao.maps.event.addListener(map.value, 'bounds_changed', function () {
    if (timeoutId) {
      clearTimeout(timeoutId); // 이전 타이머가 있으면 취소
    }

    timeoutId = setTimeout(async function () {
      if (firstLoad) {
        firstLoad = false; // 첫 호출은 바로 API를 불러왔으므로 이후엔 타이머 적용
        return;
      }

      await fetchAptData(); // API 호출 및 마커 로드

      timeoutId = null; // 타이머 초기화
    }, 200); // 0.2초 지연 (렉 최적화)
  });
}

// 실거래 최근 전세가 형태 변환 메서드
function convertToEok(num) {
  let eokValue = num / 10000;
  let roundedValue = Math.round(eokValue * 10) / 10;
  return `${roundedValue}억`;
}
// 카카오맵 marker 불러오기 (이미지 설정)
function loadMarkers() {
  complexesStore.getApt();

  for (let i = 0; i < complexesStore.aptData.length; i++) {
    const apt = complexesStore.aptData[i];

    const markerPosition = new window.kakao.maps.LatLng(
      apt.latitude,
      apt.longitude
    );

    let imageSrc = null;
    if (convertToEok(apt.recentAmount) == '0억') {
      imageSrc = '/images/property_gray.png';
    } else {
      imageSrc = '/images/property_KB.png'; // 이미지 주소
    }

    const imageSize = new kakao.maps.Size(60, 60); // 이미지 크기
    const imageOption = { offset: new kakao.maps.Point(30, 80) }; // 마커와 이미지 위치 맞추기

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

    // 최근가 형태 변환
    apt.recentAmount = convertToEok(apt.recentAmount);
    if (apt.recentAmount == '0억') apt.recentAmount = '';

    const content = document.createElement('div');
    content.innerHTML = `${apt.recentAmount}`;
    content.classList.add('imgText');

    const customOverlay = new window.kakao.maps.CustomOverlay({
      map: map.value,
      position: markerPosition,
      content: content,
      yAnchor: 2.5,
    });

    const handleClickEvent = () => {
      complexesStore.saveCurrentState({
        lat: apt.latitude,
        lon: apt.longitude,
        level: complexesStore.level,
      });
      const markerMPosition = new window.kakao.maps.LatLng(
        apt.latitude,
        apt.longitude - 0.0012 // 경도를 조금 줄여서 왼쪽으로 중심 이동
      );
      map.value.panTo(markerMPosition);
      router.push({ name: 'SBInfo' });
    };
    window.kakao.maps.event.addListener(marker, 'click', handleClickEvent);

    const overlayContent = customOverlay.getContent(); // HTML 요소 가져오기
    overlayContent.addEventListener('click', handleClickEvent);
  }
}
onMounted(() => {
  if (window.kakao && window.kakao.maps) {
    loadMap();
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
