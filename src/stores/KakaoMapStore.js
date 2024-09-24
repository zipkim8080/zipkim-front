import { defineStore } from 'pinia';

export const useKakaoMapStore = defineStore('kakaoMap', {
  state: () => ({
    map: null, // KakaoMap 인스턴스 저장
  }),
  actions: {
    // KakaoMap 인스턴스를 설정하는 메서드
    setMap(newMap) {
      this.map = newMap;
    },
    // XX동 다시보기 이벤트
    xxDongEvent() {
      if (this.map) {
        this.map.setLevel(3);
        const newCenter = new window.kakao.maps.LatLng(37.548138, 127.073397);
        this.map.setCenter(newCenter);
      }
    },
    reposition() {
      const markerPosition = new window.kakao.maps.LatLng(
        37.548138,
        127.073397
      );
      this.map.panTo(markerPosition);
    },
  },
});
