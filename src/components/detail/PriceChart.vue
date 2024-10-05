<script setup>
import axios from 'axios';
import { ref, reactive, defineProps, onMounted, watch } from 'vue';
import Chart from 'chart.js/auto';
import SimpleBuildingInfo from '@/pages/side/SimpleBuildingInfo.vue';

const props = defineProps({
  priceChart: {
    type: Object,
    required: true,
  },
});

const chartRef = ref(null);

let testfunc = () => {
  console.log('차트 데이터:', props.priceChart);
  if (Object.keys(props.priceChart).length == 0) return;

  const targetAreaId = Object.keys(props.priceChart)[0];

  const ctx = document.getElementById('myChart').getContext('2d');
  const labels = props.priceChart[targetAreaId].map(
    (item) => `${item.tradeYear}-${item.tradeMonth}`
  );

  // 매매 데이터
  const saleData = props.priceChart[targetAreaId]
    .filter((item) => item.transactionType === 'SALE')
    .map((item) => item.dealPrice);

  // 전세 데이터
  const leaseData = props.priceChart[targetAreaId]
    .filter((item) => item.transactionType === 'LEASE')
    .map((item) => item.dealPrice);

  // 매매 전세 차트
  let prevChart = Chart.getChart('myChart');
  if (prevChart !== undefined) {
    prevChart.destroy();
  }

  let newChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: '매매가',
          data: saleData,
          borderColor: 'blue',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          fill: false,
        },
        {
          label: '전세가',
          data: leaseData,
          borderColor: 'red',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          fill: false,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
};

watch(props.priceChart, (newPriceChart) => {
  testfunc();
});
</script>

<template>
  <div class="chart-container">
    <canvas id="myChart" width="400" height="200"></canvas>
  </div>
</template>

<style scoped>
.chart-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px 0;
}

canvas {
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f9f9f9;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
</style>
