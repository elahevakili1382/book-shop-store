<template>
  <div
    class="w-full max-w-[850px] h-ful bg-white rounded-3xl shadow p-5
           transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl space-y-12"
  >
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-5 gap-3">
      <h3 class="text-lg font-semibold text-gray-700">چارت فروش</h3>

      <!-- Range Switch Buttons -->
      <div class="flex items-center gap-2">
        <button
          v-for="range in ranges"
          :key="range"
          @click="selectedRange = range"
          class="px-3 py-1.5 text-sm rounded-xl transition-all duration-300"
          :class="selectedRange === range
            ? 'bg-blue-600 text-white shadow'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
        >
          {{ range }}
        </button>
      </div>
    </div>

    <!-- Growth Info -->
    <p class="text-sm text-gray-500 mb-3">
      رشد نسبت به دوره قبل:
      <span
        :class="growthRate > 0 ? 'text-green-600' : 'text-red-600'"
        class="font-semibold"
      >
        {{ growthRate > 0 ? '+' + growthRate : growthRate }}%
      </span>
    </p>

    <!-- Chart -->
    <client-only>
      <ApexChart
        type="bar"
        class="w-full"
        height="300"
        :options="chartOptions"
        :series="series"
      />
    </client-only>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useDashboardStore } from '../../stores/dashboard'
import { storeToRefs } from 'pinia'
import type { ApexOptions } from 'apexcharts'

// استور داشبورد
const dashboard = useDashboardStore()
const { products } = storeToRefs(dashboard)
const ApexChart = defineAsyncComponent(() => import('vue3-apexcharts'))

// وضعیت بازه زمانی
const selectedRange = ref<'هفتگی' | 'ماهانه' | 'سالانه'>('هفتگی')
const ranges = ['هفتگی', 'ماهانه', 'سالانه'] as const


// داده‌ی چارت
type ChartSeries = { name: string; data: number[] }
const series = ref<ChartSeries[]>([
  { name: 'فروش', data: [40, 60, 75, 50, 80, 55, 30] },
])

// نرخ رشد فرضی (برای نمایش در متن)
const growthRate = ref(12)

// گزینه‌های چارت
const chartOptions = ref<ApexOptions>({
  chart: {
    toolbar: { show: false },
    animations: {
      enabled: true,
      speed: 800,
    },
  },
  plotOptions: {
    bar: {
      borderRadius: 15,
    borderRadiusApplication: 'around',

      columnWidth: '45%',
      distributed: true,
    },
  },
  colors: [
    '#A494F4', '#8D7CDE', '#5534F9',
    '#2600FF', '#1F00D1', '#250F95', '#100641',
  ],
  xaxis: {
    categories: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
    labels: {
      style: {
        colors: '#9CA3AF',
        fontSize: '13px',
      },
    },
    axisBorder: { show: false },
    axisTicks: { show: false },
  },
  yaxis: {
    show: true,
    labels: {
      formatter: (val: number) => `${val}k`,
      style: { colors: '#9CA3AF', fontSize: '12px' },
    },
  },
  grid: { show: false },
  dataLabels: { enabled: false },
  tooltip: {
    theme: 'light',
    y: {
      formatter: (val: number) => `${val} فروش`,
    },
  },
})

// تغییر بازه زمانی
watch(selectedRange, (newVal) => {
  if (newVal === 'ماهانه') {
    series.value = [
      { name: 'فروش', data: [400, 620, 750, 500, 800, 550, 300, 710, 850, 900, 650, 770] },
    ]
    chartOptions.value = {
      ...chartOptions.value,
      xaxis: {
        ...chartOptions.value.xaxis,
        categories: ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'],
      },
    }
    growthRate.value = 9
  } else if (newVal === 'سالانه') {
    series.value = [{ name: 'فروش', data: [12000, 14500, 16000, 19000] }]
    chartOptions.value = {
      ...chartOptions.value,
      xaxis: {
        ...chartOptions.value.xaxis,
        categories: ['۱۴۰۱', '۱۴۰۲', '۱۴۰۳', '۱۴۰۴'],
      },
    }
    growthRate.value = 17
  } else {
    series.value = [{ name: 'فروش', data: [40, 60, 75, 50, 80, 55, 30] }]
    chartOptions.value = {
      ...chartOptions.value,
      xaxis: {
        ...chartOptions.value.xaxis,
        categories: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
      },
    }
    growthRate.value = 12
  }
})
</script>

<style scoped>
/* برای واکنش‌گرایی بهتر در موبایل */
@media (max-width: 640px) {
  .apexcharts-canvas {
    max-height: 250px !important;
  }
}
</style>
