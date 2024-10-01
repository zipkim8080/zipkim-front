import axios from 'axios';
import { useLoginStore } from '@/stores/LoginStore';

axios.defaults.timeout = 100000;
axios.defaults.withCredentials = true;

axios.interceptors.request.use(
  (config) => {
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
