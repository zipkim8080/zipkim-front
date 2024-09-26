<script setup>
import { ref } from 'vue';
import { requestWithFile } from '@/api/OCR';
import { defineEmits } from 'vue';

const emit = defineEmits(['ocrCompleted', 'close']);
const selectedFile = ref(null);
const isLoading = ref(false);

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    selectedFile.value = file;
  }
};

const submitFile = async () => {
  if (!selectedFile.value) {
    alert('파일을 선택하세요.');
    return;
  }

  isLoading.value = true;
  try {
    const result = await requestWithFile(selectedFile.value);
    if (result) {
      emit('ocrCompleted', result);
    }
  } catch (error) {
    console.error('OCR 처리 중 오류 발생:', error);
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="modal-backdrop" @click="$emit('close')">
    <div class="modal-container" @click.stop>
      <h1 class="my-5">내 등기 확인하기</h1>
      <div>
        <form>
          <input type="file" @change="handleFileChange" accept=".pdf" />
          <button type="button" @click="submitFile" :disabled="!selectedFile || isLoading">
            {{ isLoading ? '처리 중...' : '내 등기 확인하기' }}
          </button>
          <div style="color: red">정확한 인식을 위해 원본 pdf를 넣어주세요</div>
        </form>
      </div>
      <button @click="$emit('close')" style="margin-top: 10px">닫기</button>
    </div>
  </div>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.2);
  z-index: 1000;
}
.modal-container {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 20px;
  border-radius: 10px;
  z-index: 1001;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
