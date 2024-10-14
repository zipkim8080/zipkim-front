<script setup>
import { onMounted, ref } from 'vue';
import { defineEmits } from 'vue';
import axios from 'axios';
import PropertyDetails from '@/pages/side/PropertyDetails.vue';
import propertyRegiAPI from '@/api/PropertyRegiAPI.js';

const emit = defineEmits(['close']);
const properties = ref([]);
//JSON.parse(localStorage.getItem('properties')) ||
const displayedProperties = ref([]);
const isModalOpen = ref(false);
const selectedPropertyId = ref(null);
const props = defineProps({
  propList: Object,
});

function invertToKR(type) {
  let kr = type;
  if (kr === 'apt') {
    kr = '아파트';
  } else if (kr === 'opi') {
    kr = '오피스텔';
  } else if (kr === 'dd') {
    kr = '단독다가구';
  } else if (kr === 'yr') {
    kr = '연립다세대';
  }
  return kr;
}

const reset = () => {
  localStorage.clear();
};

const openModal = (propertyId) => {
  console.log(propertyId);
  selectedPropertyId.value = propertyId;
  isModalOpen.value = true;
};

const loadProperties = async (complexId) => {
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
        complexName: property.complexName,
        floor: property.floor,
        image: property.images && property.images.length > 0 ? property.images[0].imageUrl : '',
        hugNumber: property.hugNumber,
        type: property.type,
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
            {{ invertToKR(property.type) }}
            <img v-if="property.hugNumber" class="check" src="@/assets/images/check.png" />
          </div>
          <div class="price">전세 {{ property.deposit.toLocaleString() }} 만원</div>
          <div class="price">매매 {{ property.amount.toLocaleString() }} 만원</div>
          <div class="where">
            {{ property.complexName ? property.complexName + ' ' : '' }}{{ property.floor }}층
          </div>
        </div>
      </div>
    </div>
    <p v-if="displayedProperties.length === 0">저장된 매물이 없습니다.</p>

    <div v-if="isModalOpen" class="modal-background" @click="isModalOpen = false"></div>
    <div v-if="isModalOpen" class="modal">
      <PropertyDetails :propId="selectedPropertyId" @close="isModalOpen = false" />
    </div>
  </div>
</template>

<style scoped>
.modal-background {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0);
  z-index: 1;
}

.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  z-index: 10;
  border-radius: 8px;
}

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
  font-size: 18px;
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
