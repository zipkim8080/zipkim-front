import { defineStore } from 'pinia';
import axios from 'axios';

export const useComplexesStore = defineStore('map', {
  state: () => ({
    lat: 37.548138,
    lon: 127.073397,
    radius: 0.43,
    savedState: null, // 상태 저장 객체
    aptData: {
      resultCode: '200',
      data: [
        {
          complexId: 101893,
          type: 'apt',
          currentAverageDeposit: 'NaN',
          currentAverageAmount: 'NaN',
          recentAmount: 79000.0,
          recentDeposit: 40000.0,
          curDepositRatio: 'NaN',
          recentDepositRatio: 0.5063291139240507,
          longitude: 127.069673,
          latitude: 37.548459,
          distance: 0.063,
        },
        {
          complexId: 17695,
          type: 'apt',
          currentAverageDeposit: 'NaN',
          currentAverageAmount: 'NaN',
          recentAmount: 60500.0,
          recentDeposit: 43500.0,
          curDepositRatio: 'NaN',
          recentDepositRatio: 0.71900826446281,
          longitude: 127.068366,
          latitude: 37.54799,
          distance: 0.0721,
        },
      ],
    },
  }),
  actions: {
    setLevel(level) {
      // this.radius = level;
      if (level == 1) {
        this.radius = 0.25;
      } else if (level == 2) {
        this.radius = 0.43;
      } else if (level == 3) {
        this.radius = 0.86;
      } else if (level == 4) {
        this.radius = 1.7;
      } else if (level == 5) {
        this.radius = 3.4;
      } else if (level == 6) {
        this.radius = 6.8;
      } else if (level == 7) {
        this.radius = 13.6;
      } else if (level == 8) {
        this.radius = 26.2;
      } else if (level == 9) {
        this.radius = 50;
      } else this.radius = 100;
    },
    setLat(lat) {
      this.lat = lat;
    },
    setLon(lon) {
      this.lon = lon;
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
    async getApt() {
      const url = `http://localhost:8080/api/map/apt?lat=${this.lat}&lon=${this.lon}&radius=${this.radius}`;
      try {
        const response = await axios.get(url);
        if (response && response.data && response.data.data.length > 0) {
          // response.data.length > 0 조건에서 에러가 나는거 같으니 응답은 받는데 데이터가 없는 것 같음
          this.aptData = response.data.data; // 데이터를 상태에 저장
        } else {
          console.error('응답 데이터가 없습니다. 데이터:', response.data);
        }
      } catch (error) {
        console.error('데이터를 가져오는 중 에러 발생:', error);
        this.aptData = []; // aptData 초기화
      }
    },
  },
});
