<template>
  <div class="w-full bg-white rounded-2xl shadow p-6 mt-8">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-gray-700">Project Analytics</h3>
    </div>

    <client-only>
      <ApexChart
        type="bar"
        height="220"
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
import ApexChart from "vue3-apexcharts"


// دسترسی به استور
const dashboard = useDashboardStore()
const { products, loading } = storeToRefs(dashboard)

// واکشی داده‌ها
onMounted(() => {
  if (!products.value.length) {
    dashboard.fetchDashboardData()
  }
})

// ساخت دیتا برای چارت
const series = ref([
  {
    name: 'Progress',
    data: [40, 60, 75, 50, 80, 55, 30] // تا بعداً با API جایگزین بشه
  }
])

// تنظیمات چارت
const chartOptions = {
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
