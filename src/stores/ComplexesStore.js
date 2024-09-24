import { defineStore } from 'pinia';
import axios from 'axios';

export const useComplexesStore = defineStore('map', {
  state: () => ({
    lat: 37.5480808046514,
    lon: 127.06932600099586,
    radius: 0.09,
    aptData: [],
  }),
  actions: {
    setLevel(level) {
      if (level == 1) {
        this.radius = 0.05;
      } else if (level == 2) {
        this.radius = 0.09;
      } else if (level == 3) {
        this.radius = 0.18;
      } else if (level == 4) {
        this.radius = 0.35;
      } else if (level == 5) {
        this.radius = 0.7;
      } else if (level == 6) {
        this.radius = 1.4;
      } else if (level == 7) {
        this.radius = 2.8;
      } else if (level == 8) {
        this.radius = 5.6;
      } else if (level == 9) {
        this.radius = 11.2;
      } else this.radius = 20;
    },
    setLat(lat) {
      this.lat = lat;
    },
    setLon(lon) {
      this.lon = lon;
    },
    async getApt() {
      const url = `http://localhost:8080/api/map/apt?lat=${this.lat}&lon=${this.lon}&radius=${this.radius}`;
      try {
        const response = await axios.get(url);

        if (response && response.data) {
          // data가 잘 정의되었는지 확인
          this.aptData = response.data; // 데이터를 상태에 저장
          console.log('API 호출 성공:', this.aptData);
        } else {
          console.error('응답 데이터가 없습니다.');
        }
      } catch (error) {
        console.error('데이터를 가져오는 중 에러 발생:', error);
      }
    },
    // async getOpi() {
    //   const url = `http://localhost:8080/api/map/opi?lat=${this.lat}&lon=${this.lon}&radius=${this.radius}`;
    //   try {
    //     const response = await axios.get(url);
    //     this.aptData = response.data; // 데이터를 상태로 저장
    //   } catch (error) {
    //     console.error('Error fetching data:', error);
    //   }
    // },

    // updatePosition(lat, lon, radius) {
    //   this.lat = lat;
    //   this.lon = lon;
    //   this.radius = radius;
    // },
  },
});
