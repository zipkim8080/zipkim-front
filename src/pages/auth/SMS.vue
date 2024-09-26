<script setup>
import { defineEmits } from 'vue';
import { useLoginStore } from '@/stores/LoginStore';
import { ref } from 'vue';
import instance from '@/api/index.js';

const emit = defineEmits(['close']);
const handleClose = () => {
  emit('close');
};
// 사용자 입력 데이터와 메시지 설정을 위한 ref 변수
const phoneNumber = ref(''); // 전화번호 입력 값
const verificationCode = ref(''); // 인증번호 입력 값
const generatedCode = ref(''); // 생성한 인증번호
const message = ref(''); // 결과 메시지

const LoginStore = useLoginStore();
const token = LoginStore.getToken();
const un = token.split(':')[1];

// 인증번호 요청 메서드
const requestVerificationCode = async () => {
  try {
    // 전화번호를 포함하여 백엔드의 /auth/send API 호출
    const response = await instance.post('http://localhost:8080/sms/send', {
      phoneNumber: phoneNumber.value,
    });
    generatedCode.value = response.data.split(': ')[1];
    // 성공 시 메시지 설정
    message.value = '인증번호가 전송되었습니다. 확인해주세요.';
  } catch (error) {
    // 실패 시 에러 메시지 설정
    message.value = `인증번호 요청 실패: ${error.response?.data || error.message}`;
  }
};

// 인증번호 검증 메서드
const verifyCode = async () => {
  if (verificationCode.value === generatedCode.value) {
    message.value = '인증에 성공했습니다';
    try {
      const response = await instance.post(
        'http://localhost:8080/api/users/addPhone',
        {
          username: un,
          phoneNumber: phoneNumber.value,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('DB 성공', un);
    } catch (error) {
      console.error('DB 실패', error);
    }
  } else {
    message.value = '인증번호가 일치하지 않습니다';
  }
};
</script>

<template>
  <div class="title">
    <h1>휴대폰 인증</h1>
    <button class="close-btn" @click="handleClose">
      <i class="fa-solid fa-x"></i>
    </button>
  </div>

  <div>
    <input v-model="phoneNumber" placeholder="전화번호를 입력하세요" />
    <button @click="requestVerificationCode">본인인증 요청</button>

    <input v-model="verificationCode" placeholder="인증번호를 입력하세요" />
    <button @click="verifyCode">인증번호 확인</button>
    <p>{{ message }}</p>
  </div>
</template>

<style scoped>
.title {
  display: flex;
  justify-content: space-between;
}

.close-btn {
  border: none;
  background: none;
  margin-right: 20px;
  padding: 0px;
}
</style>
