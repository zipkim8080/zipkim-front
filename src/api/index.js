import axios from 'axios';
import { useLoginStore } from '@/stores/LoginStore';

axios.defaults.timeout = 100000;

axios.interceptors.request.use(
  (config) => {
    const loginStore = useLoginStore();
    const token = loginStore.getToken();

    if (token) {
      // console.log('axios 인터셉터에서: ', token);
      config.headers['Authorization'] = `Bearer ${token}`;
      console.log(
        'Authorization 헤더에 추가된 토큰: ',
        config.headers['Authorization']
      );
    } else {
      // console.warn('토큰이 없습니다.');
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => {
    if (response.status === 200) {
      return response;
    }
    if (response.status === 404) {
      return Promise.reject('404: 페이지 없음 ' + response.request);
    }
    return response;
  },
  async (error) => {
    if (error.response?.status === 401) {
      const loginStore = useLoginStore();
      loginStore.logout();
      //   router.push();
      return Promise.reject({ error: '로그인이 필요한 서비스입니다.' });
    }
    return Promise.reject(error);
  }
);

export default axios;
