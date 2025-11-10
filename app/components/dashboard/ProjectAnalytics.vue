<template>
<div class="w-full max-w-[800px] bg-white rounded-3xl shadow p-3 mt-[60px] transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-gray-700">چارت فروش</h3>
    </div>

    <client-only>
      <ApexChart
        type="bar"
           class="w-full"
        :options="chartOptions"
        :series="series"
      />
    </client-only>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect, onMounted } from 'vue'
import { useDashboardStore } from '~/stores/dashboard'
import { storeToRefs } from 'pinia'
import type { ApexOptions } from 'apexcharts'
import { data } from 'autoprefixer'


// دسترسی به استور
const dashboard = useDashboardStore()
const { products, loading } = storeToRefs(dashboard)
const ApexChart  = defineAsyncComponent(() => import('vue3-apexcharts'))

// واکشی داده‌ها
onMounted(() => {
  if (!products.value.length) {
    dashboard.fetchDashboardData()
  }
})

// ساخت دیتا برای چارت
type ChartSeries = {name:string; data: number[] }
const series = ref<ChartSeries[]>([
  {
    name: 'Progress',
    data: [40, 60, 75, 50, 80, 55, 30] // تا بعداً با API جایگزین بشه
  }
])



const chartOptions: ApexOptions = {
  chart: {
    toolbar: { show: false },
    sparkline: { enabled: false },
  },
  plotOptions: {
    bar: {
      borderRadius: 20,
      columnWidth: '40%',
      distributed: true,
    },
  },
  colors: [
    '#A494F4', '#C5BAFD', '#5534F9', '#2600FF', '#1F00D1', '#250F95', '#100641'
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
    show: false,
  },
  grid: {
    show: false,
  },
  dataLabels: {
    enabled: false,
  },
  tooltip: {
    theme: 'light',
    y: {
      formatter: (val: number) => `${val}%`
    }
  },
}
</script>
