<template>
  <div id="map" class="kakao-map"></div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useKakaoMapStore } from '@/stores/KakaoMapStore';
import { useComplexesStore } from '@/stores/ComplexesStore';
import { useRouter } from 'vue-router';
import emd from '@/assets/emd.json'
// import { displayArea } from '@/api/poly';
const polyData = emd.features;
let coordinates = []; //좌표 저장 배열
let name = ''; //행정구 이름
let polygons = [];
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

const displayArea = (coordinates, name) => {
  let path = [];
  let points = [];
  polygons.forEach((polygon) => {
    polygon.setMap(null); // 이전의 폴리곤데이터 제거
  });
  polygons = []; // 배열 초기화
  if (coordinates?.length >= 0)
    coordinates[0].forEach((coordinate) => {
      let point = {};
      point.x = coordinate[1];
      point.y = coordinate[0];
      points.push(point);
      path.push(new kakao.maps.LatLng(coordinate[1], coordinate[0]));
    });

  let polygon = new kakao.maps.Polygon({
    map: map.value,
    path: path, // 그려질 다각형의 좌표 배열입니다
    strokeWeight: 2, // 선의 두께입니다
    strokeColor: '#004c80', // 선의 색깔입니다
    strokeOpacity: 0.8, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
    strokeStyle: 'solid', // 선의 스타일입니다
    fillColor: '#09f', // 채우기 색깔입니다
    fillOpacity: 0.4, // 채우기 불투명도 입니다
  });

  polygons.push(polygon);

  // 다각형에 mouseover 이벤트를 등록하고 이벤트가 발생하면 폴리곤의 채움색을 변경합니다
  // 지역명을 표시하는 커스텀오버레이를 지도위에 표시합니다
  kakao.maps.event.addListener(polygon, 'mouseover', function (mouseEvent) {
    // polygon.setOptions({ fillColor: '#09f' });
  });

  // 다각형에 mousemove 이벤트를 등록하고 이벤트가 발생하면 커스텀 오버레이의 위치를 변경합니다
  kakao.maps.event.addListener(polygon, 'mousemove', function (mouseEvent) {

  });

  // 다각형에 mouseout 이벤트를 등록하고 이벤트가 발생하면 폴리곤의 채움색을 원래색으로 변경합니다
  // 커스텀 오버레이를 지도에서 제거합니다
  kakao.maps.event.addListener(polygon, 'mouseout', function () {
    // polygon.setOptions({ fillColor: '#FFFFFF05' });

  });

  // 다각형에 click 이벤트를 등록하고 이벤트가 발생하면 다각형의 이름과 면적을 인포윈도우에 표시합니다
  kakao.maps.event.addListener(polygon, 'click', function (mouseEvent) {

  });
};


// 카카오맵 map 로드하기
async function loadMap() {
  const container = document.getElementById('map');
  const options = {
    center: new window.kakao.maps.LatLng(37.57226769699021, 127.06994553827167),
    level: 2,
  };

  map.value = new window.kakao.maps.Map(container, options);

  kakaoMapStore.setMap(map.value);

  await complexesStore.getApi();
  complexesStore.loadMarkers(router); // 마커 로드

  // data.forEach((val, index) => {      //전체좌표 폴리곤그리기 
  //   coordinates = val.geometry?.coordinates;
  //   name = val.properties.SIG_KOR_NM;
  //   displayArea(coordinates, name)


  //   // displayArea(coordinates, name);
  // });


  // 이동시 좌표, 레벨 저장
  async function fetchAptData() {
    const center = map.value.getCenter();
    const level = map.value.getLevel();
    const lat = center.getLat();
    const lng = center.getLng();
    complexesStore.setLevel(level);
    complexesStore.setLat(lat);
    complexesStore.setLon(lng);

    await complexesStore.getApi(); // API 호출
    complexesStore.loadMarkers(router);  // 마커 로드
    const bgdCd = await complexesStore.xxDongApi();
    const currentPoly = polyData.filter(data => bgdCd.startsWith(data.properties.EMD_CD))
    const coord = currentPoly[0].geometry?.coordinates
    const name = currentPoly[0].properties.EMD_KOR_NM;
    displayArea(coord, name)
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
