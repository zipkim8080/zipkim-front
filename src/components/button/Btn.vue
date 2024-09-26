<script setup>
// axios 라이브러리 임포트
import instance from '@/api/index.js';
import { useLoginStore } from '@/stores/LoginStore';
import { ref, onMounted } from 'vue';

const loginStore = useLoginStore();

// user-info1 엔드포인트 호출 함수
const getUserInfo1 = async () => {
  try {
    const response = await instance.get('http://localhost:8080/test/user-info1'); // 서버에 GET 요청 전송
    alert(response.data); // 요청 결과를 알림으로 표시
  } catch (error) {
    console.error('Error fetching user info 1:', error); // 에러 발생 시 콘솔에 출력
    alert('Error fetching user info 1'); // 사용자에게 에러 알림
  }
};

// user-info2 엔드포인트 호출 함수
const getUserInfo2 = async () => {
  try {
    const response = await instance.get('http://localhost:8080/test/user-info2'); // 서버에 GET 요청 전송
    alert(response.data); // 요청 결과를 알림으로 표시
  } catch (error) {
    console.error('Error fetching user info 2:', error); // 에러 발생 시 콘솔에 출력
    alert('Error fetching user info 2'); // 사용자에게 에러 알림
  }
};

onMounted(() => {
  loginStore.loadTokenFromCookies();
});
</script>

<template>
  <!-- 각 버튼 클릭 시 해당 함수 호출 -->
  <button @click="getUserInfo1">Check User Info 1</button>
  <button @click="getUserInfo2">Check User Info 2</button>
</template>

<style scoped>
.login-overlay {
  position: absolute;
  right: 2%;
  top: 3%;
  z-index: 10; /* 지도보다 높은 값을 설정 */
}
</style>
