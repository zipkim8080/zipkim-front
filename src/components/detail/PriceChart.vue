<script setup>
import axios from 'axios';
import {
  ref,
  reactive,
  defineProps,
  onMounted,
  watch,
  onUpdated,
  nextTick,
} from 'vue';
import Chart from 'chart.js/auto';
import SimpleBuildingInfo from '@/pages/side/SimpleBuildingInfo.vue';

const props = defineProps({
  priceChart: {
    type: Object,
    required: true,
  },
  areaIdToPyeongName: {
    type: Object,
    required: true,
  },
});

const state = reactive({
  items: [],
  selectedItem: null,
  averageLeaseRate: null,
});

onMounted(() => {
  const targetId = Object.keys(props.priceChart).find(
    (key) => props.areaIdToPyeongName[key] === state.selectedItem
  );
  drawChart(targetId);
});
const chartRef = ref(null);

const calculateAverageLeaseRate = (targetAreaId) => {
  const leasePrices = [];
  const salePrices = [];

  props.priceChart[targetAreaId]?.forEach((item) => {
    if (item == undefined) return;
    if (item.transactionType === 'LEASE') {
      leasePrices.push(item.dealPrice);
    } else if (item.transactionType === 'SALE') {
      salePrices.push(item.dealPrice);
    }
  });

  const averageLease =
    leasePrices.length > 0
      ? leasePrices.reduce((a, b) => a + b, 0) / leasePrices.length
      : 0;
  const averageSale =
    salePrices.length > 0
      ? salePrices.reduce((a, b) => a + b, 0) / salePrices.length
      : 0;

  if (averageSale > 0) {
    return (averageLease / averageSale) * 100;
  }
  return 0;
};

const drawChart = (targetAreaId) => {
  if (Object.keys(props.priceChart).length === 0) return;
  // const areaIdToPyeongName = props.areaIdToPyeongName;
  // const AreaId = Object.keys(props.priceChart);
  // const targetAreaId = Object.keys(props.priceChart)[0]; // 평수

  // 연도별 데이터
  const yearlyData = {};
  props.priceChart[targetAreaId].forEach((item) => {
    if (item == undefined) return;
    const year = item.tradeYear;
    if (!yearlyData[year]) {
      yearlyData[year] = { sales: [], leases: [] };
    }
    if (item.transactionType === 'SALE') {
      yearlyData[year].sales.push(item.dealPrice);
    } else if (item.transactionType === 'LEASE') {
      yearlyData[year].leases.push(item.dealPrice);
    }
  });

  const labels = Object.keys(yearlyData);
  const saleData = labels.map((year) => {
    const sales = yearlyData[year].sales;
    return sales.length
      ? sales.reduce((a, b) => a + b, 0) / sales.length
      : null; // 평균 계산
  });
  const leaseData = labels.map((year) => {
    const leases = yearlyData[year].leases;
    return leases.length
      ? leases.reduce((a, b) => a + b, 0) / leases.length
      : null; // 평균 계산
  });

  const ctx = document.getElementById('myChart')?.getContext('2d');
  let prevChart = Chart.getChart('myChart');
  if (prevChart) {
    prevChart.destroy();
  }

  new Chart(ctx, {
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
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          fill: false,
        },
      ],
    },
    options: {
      spanGaps: true,
      scales: {
        y: {
          beginAtZero: true,
        },
      },
      plugins: {
        tooltip: {
          callbacks: {
            title: (tooltipItems) => {
              return tooltipItems[0].label; // 연도
            },
            label: (tooltipItem) => {
              return `가격: ${tooltipItem.raw.toLocaleString()} (만원)`; // 가격
            },
          },
        },
      },
    },
  });
};

function change() {
  if (!state.selectedItem) return; // selectedItem이 null인 경우 조기 리턴
  const targetAreaId = Object.keys(props.priceChart).find(
    (key) => props.areaIdToPyeongName[key] === state.selectedItem
  );
  drawChart(targetAreaId);
  state.averageLeaseRate = calculateAverageLeaseRate(targetAreaId);
}

// watch(props.priceChart, (newPriceChart) => {
//   drawChart();
// });

// areaIdToPyeongName 값으로 items 업데이트
watch(
  props.areaIdToPyeongName,
  (newAreaIdToPyeongName) => {
    state.items = Object.values(newAreaIdToPyeongName);
    if (state.items.length > 0) {
      state.selectedItem = state.items[0];
      nextTick(() => {
        change();
      });
    }
  },
  { immediate: true }
);
</script>

<template>
  <div class="layout">
    <div class="header">
      <div class="average-section">
        <h5 style="font-weight: bold">평균 전세가율</h5>
        <h5 style="color: #f3b706">
          {{
            state.averageLeaseRate
              ? state.averageLeaseRate.toFixed(2) + '%'
              : '-'
          }}
        </h5>
      </div>
      <div class="dropdown-section">
        <h5 style="font-weight: bold">타입 선택</h5>
        <select v-model="state.selectedItem" @change="change">
          <option
            v-for="each in state.items"
            :key="each"
            v-text="each"
            :value="each"
          ></option>
        </select>
      </div>
    </div>
    <div class="chart-container">
      <canvas id="myChart" width="400" height="200"></canvas>
    </div>
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

.layout {
  display: flex;
  flex-direction: column;
}

.header {
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 0 8px;
  margin-top: 10px;
}

.average-section,
.dropdown-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-height: 120px;
}

select {
  width: 75px;
}
</style>
