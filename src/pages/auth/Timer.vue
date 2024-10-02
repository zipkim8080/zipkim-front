<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import axios from '@/api/index';
import Cookies from 'js-cookie'; // 쿠키 관리용 라이브러리
import { jwtDecode } from 'jwt-decode'; // JWT 디코딩용 라이브러리
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import { useLoginStore } from '@/stores/LoginStore';

const loginStore = useLoginStore();
const remainingTime = ref(''); // 남은 시간을 저장
let timer = null;

// 남은 시간 계산 함수
const calculateRemainingTime = () => {
  const token = Cookies.get('Authorization'); // 쿠키에서 access token 가져오기
  if (token) {
    const decoded = jwtDecode(token); // 토큰 디코딩
    const expirationTime = decoded.exp * 1000; // exp는 초 단위이므로 밀리초로 변환
    const currentTime = Date.now();
    const remainingMs = expirationTime - currentTime;

    if (remainingMs > 0) {
      const minutes = Math.floor(remainingMs / 60000);
      const seconds = Math.floor((remainingMs % 60000) / 1000)
        .toString()
        .padStart(2, '0');
      remainingTime.value = `${minutes} : ${seconds}`;
    } else {
      remainingTime.value = '';
      clearInterval(timer); // 만료 시 타이머 정지
    }
  } else {
    remainingTime.value = '';
  }
};

// 로그인 연장 요청 함수
const extendSession = async () => {
  try {
    const response = await axios.post('/api/reissue');

    const { access, refresh } = response.data;
    loginStore.loadTokenFromCookies();
    // console.log(response.data);

    Cookies.set('Authorization', access, { expires: 1 / 48 });
    Cookies.set('Refresh', refresh, { expires: 1 / 12 });

    if (response.status === 200) {
      toast('로그인 시간이 연장되었습니다!', {
        theme: 'auto', // 테마(auto, light, dark, colored)
        type: 'success', // 타입(info, success, warning, error, default)
        position: 'top-center', //토스트 생성위치
        pauseOnHover: false, //마우스오버시 멈춤 제거
        autoClose: 1000, //자동닫기
        hideProgressBar: true, //로딩바제거
      });
      // 갱신된 토큰이 쿠키에 저장되었다고 가정하고, 남은 시간을 다시 계산
      calculateRemainingTime();
    } else {
      console.log('로그인 연장 실패:', response);
      toast('로그인 연장 실패', {
        theme: 'auto', // 테마(auto, light, dark, colored)
        type: 'error', // 타입(info, success, warning, error, default)
        position: 'top-center', //토스트 생성위치
        pauseOnHover: false, //마우스오버시 멈춤 제거
        autoClose: 2000, //자동닫기
        hideProgressBar: true, //로딩바제거
      });
    }
  } catch (error) {
    console.error('로그인 연장 오류:', error);
    toast('로그인을 해주세요', {
      theme: 'auto', // 테마(auto, light, dark, colored)
      type: 'error', // 타입(info, success, warning, error, default)
      position: 'top-center', //토스트 생성위치
      pauseOnHover: false, //마우스오버시 멈춤 제거
      autoClose: 2000, //자동닫기
      hideProgressBar: true, //로딩바제거
    });
  }
};

// 컴포넌트 마운트 시 실행
onMounted(() => {
  calculateRemainingTime(); // 처음 화면이 로드될 때 남은 시간 계산
  timer = setInterval(calculateRemainingTime, 1000); // 1초마다 남은 시간 업데이트
});

onBeforeUnmount(() => {
  clearInterval(timer); // 컴포넌트가 제거될 때 타이머 정지
});
</script>

<template>
  <div class="login-overlay">
    <div class="container">
      <div class="time">{{ remainingTime }}</div>
      <button class="kb_btn" @click="extendSession">로그인 연장</button>
    </div>
  </div>
</template>

<style scoped>
.container {
  width: 270px;
  display: flex;
  justify-content: space-between;
}

.time {
  text-align: center;
  align-items: center;
  line-height: -1px;
  font-size: 29px;
  font-weight: bold;
  padding-top: 1px;
  margin: 0px;
}

.login-overlay {
  position: absolute;
  right: 4.7%;
  top: 3%;
  z-index: 10;
}
</style>
