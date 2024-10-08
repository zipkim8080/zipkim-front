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
const showLogoutModal = ref(false);

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
      logoutModal();
      clearInterval(timer); // 만료 시 타이머 정지
    }
  } else {
    remainingTime.value = '';
  }
};

const logoutModal = () => {
  showLogoutModal.value = true;
};

const logout = async () => {
  try {
    // await axios.post('/api/logout');
    loginStore.logout();
    window.location.reload();
  } catch (error) {
    console.log(error);
  }
};

// 로그인 연장 요청 함수
const extendSession = async () => {
  try {
    const response = await axios.post('/api/reissue');

    const { access, refresh } = response.data;

    loginStore.setAccessToken(access);
    loginStore.setRefreshToken(refresh);

    Cookies.set('Authorization', access, { expires: 1 / 48 });
    Cookies.set('Refresh', refresh, { expires: 1 / 12 });

    if (response.status === 200) {
      toast('로그인 시간이 연장되었습니다!', {
        theme: 'auto', // 테마(auto, light, dark, colored)
        type: 'success', // 타입(info, success, warning, error, default)
        position: 'top-center', //토스트 생성위치
        pauseOnHover: false, //마우스오버시 멈춤 제거
        autoClose: 1500, //자동닫기
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
  <template v-if="showLogoutModal">
    <div class="logout-modal">
      <div class="modal-content">
        <div class="content">장시간 사용이 없어 자동 로그아웃 됩니다.</div>
        <button class="btn" @click="logout">확인</button>
      </div>
    </div>
  </template>

  <template v-if="remainingTime !== ''">
    <div class="login-overlay">
      <div class="container">
        <div class="time">{{ remainingTime }}</div>
        <button class="kb_btn button" @click="extendSession">연장</button>
      </div>
    </div>
  </template>
  <template v-else> </template>
</template>

<style scoped>
.container {
  width: 260px;
  display: flex;
}
.button {
  border-radius: 0px 10px 10px 0px;
  font-size: 22px;
  padding: 7px 13px 5px 13px;
  /* font-weight: bold; */
}
.time {
  background: #fff;
  text-align: center;
  align-items: center;
  line-height: -1px;
  font-size: 20px;
  padding-top: 8px;
  margin: 0px;
  width: 95px;
  border-radius: 10px 0px 0px 10px;
  color: #f3b706;
}

.login-overlay {
  position: absolute;
  right: 1.3%;
  top: 2%;
  z-index: 10;
  transform: translateX(7%);
}

.logout-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  width: 380px;
}

.content {
  padding-top: 10px;
  padding-bottom: 30px;
  font-size: 19px;
}

.btn {
  border-radius: 10px;
  background: #f3b706;
  height: 40px;
  width: 100%;
  color: #ffffff;
  font-weight: 600;
  font-size: 19px;
  padding: 0px;
}

.btn:hover {
  background: #f2d383;
}
</style>
