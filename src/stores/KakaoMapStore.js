import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useComplexesStore } from '@/stores/ComplexesStore';

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
      const complexesStore = useComplexesStore();

      if (this.map) {
        this.map.setLevel(4);
        const newCenter = new window.kakao.maps.LatLng(
          complexesStore.cenX,
          complexesStore.cenY
        );
        this.map.setCenter(newCenter);
      }
    },
    reposition(lat, lon) {
      const markerPosition = new window.kakao.maps.LatLng(lat, lon);
      this.map.panTo(markerPosition);
    },
  },
});
