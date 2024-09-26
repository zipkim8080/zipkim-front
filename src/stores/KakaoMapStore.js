import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useKakaoMapStore = defineStore('kakaoMap', {
  state: () => ({
    map: ref(null), // KakaoMap 인스턴스 저장
  }),
  actions: {
    // KakaoMap 인스턴스를 설정하는 메서드
    setMap(newMap) {
      this.map = newMap;
    },
    getMap() {
      return this.map; // map 반환
    },
    // XX동 다시보기 이벤트
    xxDongEvent() {
      if (this.map) {
        this.map.setLevel(3);
        const newCenter = new window.kakao.maps.LatLng(37.548138, 127.073397);
        this.map.setCenter(newCenter);
      }
    },
    reposition(lat, lon) {
      const markerPosition = new window.kakao.maps.LatLng(lat, lon);
      this.map.panTo(markerPosition);
    },
  },
});
