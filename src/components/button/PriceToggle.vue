<template>
  <div class="priceToggle-overlay">
    <div>
      <button
        class="kb_btn3 mb-1"
        :class="{ active: complexesStore.isActualClicked }"
        :disabled="complexesStore.actPriceButtonDisabled"
        @click="actualClick"
      >
        실거래가
      </button>
    </div>
    <div>
      <button
        class="kb_btn3"
        :class="{ active: !complexesStore.isActualClicked }"
        @click="currentClick"
      >
        현매물가
      </button>
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue';
import { useComplexesStore } from '@/stores/ComplexesStore';
import { useRouter } from 'vue-router';

const complexesStore = useComplexesStore();
const router = useRouter();

function actualClick() {
  complexesStore.togglePriceType('recentDeposit');
  complexesStore.loadMarkers(router);
}
function currentClick() {
  complexesStore.togglePriceType('currentAverageAmount');
  complexesStore.loadMarkers(router);
}
</script>

<style>
.priceToggle-overlay {
  position: absolute;
  top: 22px;
  left: 495px;
  z-index: 10;
}
</style>
