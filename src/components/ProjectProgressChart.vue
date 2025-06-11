<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import Chart from 'chart.js/auto'

const props = defineProps({
  progress: {
    type: Number,
    required: true,
    default: 0
  },
  status: {
    type: String,
    required: false,
    default: 'Planning'
  }
})

const chartContainer = ref<HTMLCanvasElement | null>(null)
let chart: Chart | null = null

// Fungsi untuk mendapatkan warna berdasarkan status dan progress
const getStatusColor = () => {
  switch (props.status) {
    case 'Planning':
      return '#3498db' // Biru
    case 'In Progress':
      return '#f39c12' // Oranye
    case 'Completed':
      return '#2ecc71' // Hijau
    default:
      return '#3498db' // Default biru
  }
}

// Inisialisasi chart
const initChart = () => {
  if (!chartContainer.value) return

  const ctx = chartContainer.value.getContext('2d')
  if (!ctx) return

  chart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Progress', 'Remaining'],
      datasets: [{
        data: [props.progress, 100 - props.progress],
        backgroundColor: [
          getStatusColor(),
          '#ecf0f1' // Abu-abu muda untuk sisa
        ],
        borderWidth: 0,
        cutout: '75%'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              return context.label + ': ' + context.raw + '%'
            }
          }
        }
      }
    }
  })
}

// Update chart ketika progress berubah
const updateChart = () => {
  if (chart) {
    chart.data.datasets[0].data = [props.progress, 100 - props.progress]
    chart.data.datasets[0].backgroundColor[0] = getStatusColor()
    chart.update()
  }
}

// Watch untuk perubahan progress atau status
watch(() => props.progress, updateChart)
watch(() => props.status, updateChart)

onMounted(() => {
  initChart()
})
</script>

<template>
  <div class="chart-container">
    <canvas ref="chartContainer" height="200"></canvas>
    <div class="progress-text">
      <span class="progress-value">{{ progress }}%</span>
      <span class="progress-label">{{ status }}</span>
    </div>
  </div>
</template>

<style scoped>
.chart-container {
  position: relative;
  height: 200px;
  width: 100%;
  margin: 1rem 0;
}

.progress-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.progress-value {
  display: block;
  font-size: 1.8rem;
  font-weight: bold;
  color: #333;
}

.progress-label {
  display: block;
  font-size: 0.9rem;
  color: #666;
  margin-top: 0.25rem;
}
</style> 