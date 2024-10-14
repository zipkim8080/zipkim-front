//git
<script setup>
import { onMounted, ref } from 'vue';
import { defineEmits } from 'vue';
import axios from 'axios';
import PropertyDetails from '@/pages/side/PropertyDetails.vue';

const emit = defineEmits(['close']);
const properties = ref([]);
//JSON.parse(localStorage.getItem('properties')) ||
const displayedProperties = ref([]);
const isModalOpen = ref(false);
const selectedPropertyId = ref(null);
const props = defineProps({
  propList: Object,
});

const reset = () => {
  localStorage.clear();
};

const openModal = (propertyId) => {
  console.log(propertyId);
  selectedPropertyId.value = propertyId;
  isModalOpen.value = true;
};

const loadProperties = async () => {
  const storedProperties = localStorage.getItem('propInfo');
  if (storedProperties) {
    let propertiesData = JSON.parse(storedProperties);
    if (!Array.isArray(propertiesData)) {
      propertiesData = [propertiesData];
    }
    propertiesData.push();

    const propertiesToDisplay = propertiesData.map((property) => {
      return {
        propId: property.propId,
        amount: property.amount,
        deposit: property.deposit,
        floor: property.complexName + property.floor,
        image: property.images && property.images.length > 0 ? property.images[0].imageUrl : '',
      };
    });

    displayedProperties.value = propertiesToDisplay.reverse().slice(0, 7);
    console.log(`매물 수 :  + ${propertiesToDisplay.length}`);
    localStorage.setItem('propInfo', JSON.stringify(propertiesData));
  } else if (!storedProperties) {
    displayedProperties.value = [];
  }
};

// 컴포넌트가 마운트될 때 데이터 로딩
onMounted(() => {
  loadProperties();
});

/*const saveToLocalStorage = (propertyName) => {
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
};*/

const clear = () => {
  localStorage.clear();
  properties.value = [];
};
const handleClose = () => {
  emit('close');
};

defineExpose({ loadProperties });
</script>

<template>
  <div class="list">
    <div>
      <div
        v-for="(property, index) in displayedProperties"
        :key="index"
        class="content-box"
        @click="openModal(property.propId)"
      >
        <div class="img">
          <img
            style="width: 200px; height: 130px; border-radius: 5px; margin-right: 15px"
            :src="property.image"
          />
        </div>
        <div class="content">
          <div class="type">
            {{ 'apt' }}
            <img class="check" src="@/assets/images/check.png" alt="체크 이미지" />
            <div v-if="isModalOpen" class="modal">
              <PropertyDetails :propId="selectedPropertyId" @close="isModalOpen = false" />
            </div>
          </div>
          <div class="price">전세 {{ property.deposit.toLocaleString() }} 만원</div>
          <div class="price">매매 {{ property.amount.toLocaleString() }} 만원</div>
          <div class="where">{{ property.floor }} 층</div>
        </div>
      </div>
    </div>
    <p v-if="displayedProperties.length === 0">저장된 매물이 없습니다.</p>
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
.content-box {
  padding: 15px 0px;
  display: flex;
  width: 400px;
  /* border-top: 0.5px solid #ccc; */
  border-bottom: 0.1px solid #ccc;
}

.price {
  /* font-size: 1.5rem; */
  font-size: 22px;
  font-weight: bold;
}

.where {
  font-size: 16px;
}

.check {
  height: 17px;
}

.content-box:hover {
  transform: scale(1.02);
}
</style>
