<script setup>
import { defineEmits } from 'vue';
import { useLoginStore } from '@/stores/LoginStore';
import { ref } from 'vue';
import axios from '@/api/index';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

const emit = defineEmits(['close', 'updatePhoneNumber']);
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

// 인증번호 요청 메서드
const requestVerificationCode = async () => {
  try {
    // 전화번호를 포함하여 백엔드의 /auth/send API 호출
    const response = await axios.post('https://zipkimserver.store/api/sms/send', {
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
  if (!verificationCode.value) {
    message.value = '인증번호를 입력해주세요';
  } else if (verificationCode.value === generatedCode.value) {
    message.value = '인증에 성공했습니다';
    toast('휴대폰 인증에 성공했습니다!', {
      theme: 'auto', // 테마(auto, light, dark, colored)
      type: 'success', // 타입(info, success, warning, error, default)
      position: 'top-center', //토스트 생성위치
      pauseOnHover: false, //마우스오버시 멈춤 제거
      autoClose: 1000, //자동닫기
      hideProgressBar: true, //로딩바제거
    });
    try {
      await axios.post('https://zipkimserver.store/api/phone', {
        phoneNumber: phoneNumber.value,
      });
      console.log('DB 성공');
      emit('updatePhoneNumber'); // 인증 성공 시 갱신 요청 이벤트 발생
      handleClose(); // 인증에 성공하면 모달을 닫음
    } catch (error) {
      console.error('DB 실패', error);
    }
  } else {
    message.value = '인증번호가 일치하지 않습니다';
  }
};
</script>

<template>
  <div class="modal-overlay" @click.self="handleClose">
    <div class="modal-container">
      <div class="modal-header">
        <h2>휴대폰 인증</h2>
        <button class="close-btn" @click="handleClose">
          <i class="fa-solid fa-x"></i>
        </button>
      </div>
      <p>휴대폰 번호를 입력하세요.</p>
      <!-- 인증번호 발송 버튼을 입력란 내부에 위치시킴 -->
      <div class="input-group">
        <input v-model="phoneNumber" type="text" placeholder="휴대폰 번호 입력" />
        <button class="send-code-btn" @click="requestVerificationCode">인증번호 발송</button>
      </div>
      <input
        v-model="verificationCode"
        type="text"
        placeholder="인증번호를 입력하세요"
        class="verification-input"
      />
      <button class="verify-btn" @click="verifyCode">확인</button>
      <p class="message">{{ message }}</p>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-container {
  background: #fff;
  border-radius: 10px;
  padding: 20px;
  width: 400px;
  height: 310px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.close-btn {
  background: none;
  border: none;
  cursor: pointer;
}

.input-group {
  position: relative; /* 입력란과 버튼을 감싸는 컨테이너 */
  display: flex;
  margin-bottom: 10px;
}

input[type='text'] {
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 10px 15px;
  width: 100%;
  font-size: 14px;
  padding-right: 100px; /* 버튼이 겹치지 않도록 오른쪽 여백 설정 */
  box-sizing: border-box;
}

.send-code-btn {
  position: absolute; /* 버튼을 입력란 내부에 배치 */
  top: 50%;
  right: 5px;
  transform: translateY(-50%);
  background: #007bff;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
}

.verification-input {
  margin-bottom: 10px;
  width: calc(100% - 20px);
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 10px;
  font-size: 14px;
}

.verify-btn {
  background: #ffc107;
  color: white;
  border: none;
  padding: 10px;
  width: 100%;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

.message {
  margin-top: 10px;
  color: #ff4d4d;
  font-size: 14px;
}
</style>
