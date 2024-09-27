import { defineStore } from 'pinia';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

export const useLoginStore = defineStore('auth', {
  state: () => ({
    accessToken: null, // JWT 토큰을 저장할 상태
    email: null,
    name: null,
  }),
  actions: {
    // 토큰을 상태에 저장하는 액션
    setAccessToken(token) {
      this.accessToken = token;
      // console.log('토큰이 상태에 저장: ', this.accessToken);
    },

    setEmailAndName(email, name) {
      this.email = email;
      this.name = name;
      // console.log('이메일과 이름 ', email, name);
    },

    // 쿠키에서 JWT 토큰을 읽어와 상태에 저장하는 액션
    loadTokenFromCookies() {
      const token = Cookies.get('Authorization'); // 쿠키에서 'Authorization'이라는 이름의 토큰을 읽음
      if (token) {
        this.setAccessToken(token); // 토큰을 상태에 저장
        const payload = jwtDecode(token);

        this.setEmailAndName(payload.email, payload.name);

        console.log('토큰이 저장되었습니다:', token);
        console.log(payload);
      } else {
        console.error('쿠키에서 토큰을 찾을 수 없습니다.');
      }
    },

    getToken() {
      return this.accessToken;
    },

    isAuthenticated() {
      return !!this.accessToken;
    },

    logout() {
      this.accessToken = null;
      this.isAuthenticated = false;
      this.name = null;
      this.email = null;
      Cookies.remove('Authorization');
      console.log('토큰이 삭제되었습니다.');
    },
  },
});
