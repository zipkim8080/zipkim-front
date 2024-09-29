<script setup>
import { ref } from 'vue';
import { defineEmits } from 'vue';

const emit = defineEmits(['close']);
const properties = ref(JSON.parse(localStorage.getItem('properties')) || []);

const saveToLocalStorage = (propertyName) => {
  // 중복 확인: 이미 저장된 매물이라면 저장하지 않음
  if (properties.value.includes(propertyName)) {
    const index = properties.value.indexOf(propertyName);

    if (index !== properties.value.length - 1) {
      // 매물이 마지막이 아니면 제거하고 다시 추가
      properties.value.splice(index, 1);
      properties.value.push(propertyName);
    }
  } else {
    // 중복되지 않은 경우 + 5개 이상의 매물이 저장되어 있으면 가장 오래된 매물 삭제
    if (properties.value.length >= 5) {
      properties.value.shift(); // 배열의 첫 번째 요소 삭제
    }

    properties.value.push(propertyName); // 새로운 매물 추가
  }

  // 로컬스토리지에 매물 목록 저장
  localStorage.setItem('properties', JSON.stringify(properties.value));

  // 저장된 매물 확인을 위한 콘솔 출력 (필요 시 삭제)
  console.log('저장된 매물:', properties.value);
};

const clear = () => {
  localStorage.clear();
  properties.value = [];
};
const handleClose = () => {
  emit('close');
};
</script>

<template>
  <div class="title">
    <h1>최근 본 매물</h1>
  </div>
  <div>
    <button v-for="num in 7" :key="num" @click="saveToLocalStorage(`매물${num}`)">
      매물{{ num }}
    </button>
    <button @click="clear">초기화</button>
  </div>
  <ul>
    <li v-for="i in properties.length" :key="i">
      {{ properties[properties.length - i] }}
    </li>
  </ul>
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
