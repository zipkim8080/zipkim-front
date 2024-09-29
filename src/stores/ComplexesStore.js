import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';
import { useKakaoMapStore } from '@/stores/KakaoMapStore';

export const useComplexesStore = defineStore('map', {
  state: () => ({
    lat: 37.548138,
    lon: 127.073397,
    radius: 0.3,
    savedState: null, // 상태 저장 객체
    type: 'apt',
    apiData: null,
    markers: ref([]), // 마커 배열
    overlays: ref([]), // 오버레이 배열
    map: ref(null), // 맵 객체
    cenX: '',
    cenY: '',
    dong: '',
  }),
  actions: {
    setLevel(level) {
      if (level == 1) {
        this.radius = 0.15;
      } else if (level == 2) {
        this.radius = 0.3;
      } else if (level == 3) {
        this.radius = 0.6;
      } else if (level == 4) {
        this.radius = 1.2;
      } else if (level == 5) {
        this.radius = 2.4;
      } else if (level == 6) {
        this.radius = 3.8;
      } else if (level == 7) {
        this.radius = 6.6;
      } else if (level == 8) {
        this.radius = 12.2;
      } else if (level == 9) {
        this.radius = 24;
      } else this.radius = 48;
    },
    setLat(lat) {
      this.lat = lat;
    },
    setLon(lon) {
      this.lon = lon;
    },
    setType(type) {
      this.type = type;
      this.clearData(); // 기존 데이터를 초기화
      this.getApi(type); // 새로운 타입에 맞는 API 데이터 호출
    },
    clearData() {
      this.apiData = null; // 기존 API 데이터 초기화
    },
    saveCurrentState(state) {
      this.savedState = { ...state }; // 현재 상태를 복사하여 저장
    },
    restoreState() {
      if (this.savedState) {
        // 저장된 상태가 있다면 복원
        Object.assign(this.$state, this.savedState);
      }
    },
    async getApi() {
      const url = `http://localhost:8080/api/map/${this.type}?lat=${this.lat}&lon=${this.lon}&radius=${this.radius}`;
      try {
        const response = await axios.get(url);
        if (response && response.data && response.data.data.length > 0) {
          this.apiData = response.data.data; // 데이터를 상태에 저장
        } else {
          this.apiData = [];
        }
      } catch (error) {
        console.error('데이터를 가져오는 중 에러 발생:', error);
        this.apiData = []; // aptData 초기화
      }
    },

    async xxDongApi() {
      const curX = this.lon;
      const curY = this.lat;

      const apiKey = 'KakaoAK 609c68dddc59d91ca2017c852a101b1b';
      const apiUrl = `https://dapi.kakao.com/v2/local/geo/coord2regioncode.json?x=${curX}&y=${curY}`;
      try {
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            Authorization: apiKey,
          },
        });
        const data = await response.json();
        if (data.documents.length > 0) {
          const { region_3depth_name, x, y } = data.documents[0];
          this.cenX = y;
          this.cenY = x;
          this.dong = region_3depth_name;
        } else {
          throw new Error('동을 찾을 수 없습니다.');
        }
      } catch (error) {
        console.error('동을 가져오는 중 오류 발생:', error);
        throw error;
      }
    },

    // 실거래 기준 최근 전세가 형태 변환
    convertToEok(num) {
      let eokValue = num / 10000;
      let roundedValue = Math.round(eokValue * 10) / 10;
      return `${roundedValue}억`;
    },

    // 전세가율 계산 함수 (전세가 / 매매가 * 100)
    depositRateCal(dep, amo) {
      let depositRate = (dep / amo) * 100;
      return depositRate;
    },

    removeAllMarkersAndOverlays() {
      for (let i = 0; i < this.markers.length; i++) {
        this.markers[i].setMap(null); // 맵에서 마커 제거
      }
      this.markers = []; // 마커 배열 초기화
      for (let i = 0; i < this.overlays.length; i++) {
        this.overlays[i].setMap(null); // 맵에서 오버레이 제거
      }
      this.overlays = []; // 오버레이 배열 초기화
    },

    loadMarkers(router) {
      const kakaoMapStore = useKakaoMapStore();
      const map = kakaoMapStore.getMap();

      this.removeAllMarkersAndOverlays(); // 마커 및 오버레이 모두 삭제
      if (!this.apiData) return;
      this.getApi();

      for (let i = 0; i < this.apiData.length; i++) {
        const apt = this.apiData[i];

        const markerPosition = new window.kakao.maps.LatLng(
          apt.latitude,
          apt.longitude
        );

        let imageSrc = '';
        // if (this.convertToEok(apt.recentDeposit) === '0억') {
        //   imageSrc = '/images/property_gray.png';
        // } else {
        //   imageSrc = '/images/property_KB.png';
        // }
        if (this.depositRateCal(apt.recentDeposit, apt.recentAmount) >= 90) {
          imageSrc = '/images/property_red.png';
        } else if (
          this.depositRateCal(apt.recentDeposit, apt.recentAmount) >= 80
        ) {
          imageSrc = '/images/property_orange.png';
        } else if (
          this.depositRateCal(apt.recentDeposit, apt.recentAmount) >= 70
        ) {
          imageSrc = '/images/property_yellow.png';
        } else if (
          this.depositRateCal(apt.recentDeposit, apt.recentAmount) >= 60
        ) {
          imageSrc = '/images/property_greenL.png';
        } else if (this.convertToEok(apt.recentDeposit) === '0억') {
          imageSrc = '/images/property_gray.png';
        } else {
          imageSrc = '/images/property_green.png';
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

        marker.setMap(map); // map에 마커 추가
        this.markers.push(marker); // 마커 배열에 추가

        // 실거래 기준 최근 전세가 형태 변환
        apt.recentDeposit = this.convertToEok(apt.recentDeposit);
        if (apt.recentDeposit === '0억') apt.recentDeposit = '';

        const content = document.createElement('div');
        content.innerHTML = `${apt.recentDeposit}`;
        content.classList.add('imgText');

        const customOverlay = new window.kakao.maps.CustomOverlay({
          map: map,
          position: markerPosition,
          content: content,
          yAnchor: 2.5,
        });
        this.overlays.push(customOverlay); // 오버레이 배열에 추가

        const handleClickEvent = () => {
          this.saveCurrentState({
            lat: apt.latitude,
            lon: apt.longitude,
            level: this.level,
          });
          const markerMPosition = new window.kakao.maps.LatLng(
            apt.latitude,
            apt.longitude - 0.0012 // 경도를 조금 줄여서 왼쪽으로 중심 이동
          );
          map.panTo(markerMPosition);

          router.push({ name: 'SBInfo', params: { complexId: apt.complexId } });
        };
        window.kakao.maps.event.addListener(marker, 'click', handleClickEvent);
        content.addEventListener('click', handleClickEvent);
      }
    },

    removeOutOfBoundsMarkersAndOverlays() {
      const kakaoMapStore = useKakaoMapStore();
      const map = kakaoMapStore.getMap();

      const bounds = map.getBounds(); // 현재 맵의 보이는 영역

      for (let i = 0; i < this.markers.length; i++) {
        const marker = this.markers[i];
        const markerPosition = marker.getPosition();

        // 마커가 현재 보이는 영역 밖에 있으면 삭제
        if (!bounds.contain(markerPosition)) {
          marker.setMap(null); // 맵에서 마커 제거
        }
      }

      // 배열에서 삭제된 마커들을 제거
      this.markers = this.markers.filter((marker) => marker.getMap() !== null);

      for (let i = 0; i < this.overlays.length; i++) {
        const overlay = this.overlays[i];
        const overlayPosition = overlay.getPosition();
        if (!bounds.contain(overlayPosition)) {
          overlay.setMap(null);
        }
      }
      this.overlays = this.overlays.filter(
        (overlay) => overlay.getMap() !== null
      );
    },
  },
});
