<template>
  <div class="w-full rounded-2xl border border-[#2A2D36] p-5 space-y-5 shadow-lg shadow-black/30"
    style="background:#1C1E24">
    <div class="flex items-center justify-between gap-3">
      <h3 class="text-lg font-bold text-[#F5F2EB]">روند ثبت‌نام کاربران</h3>
      <span class="text-[10px] font-bold tracking-wide px-2.5 py-1 rounded-full"
        style="background:#7EDCB51A; color:#7EDCB5">
        کاربران
      </span>
    </div>

    <p v-if="dashboardStore.loading" class="text-sm text-[#A8A29E] py-8 text-center">
      در حال بارگذاری...
    </p>
    <p v-else-if="totalUsers === 0"
      class="text-sm text-[#A8A29E] py-8 text-center border border-dashed border-[#2A2D36] rounded-xl">
      داده‌ای برای نمایش وجود ندارد
    </p>

    <client-only>
      <ApexChart v-if="!dashboardStore.loading && totalUsers > 0"
        type="area" height="280" :options="chartOptions" :series="userTrend.series" />
    </client-only>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ApexOptions } from 'apexcharts'
import { useDashboardStore } from '../../stores/dashboard'

const dashboardStore = useDashboardStore()
const ApexChart = defineAsyncComponent(() => import('vue3-apexcharts'))

const totalUsers = computed(() => dashboardStore.totalUsers)

const userTrend = computed(() => {
  const now = new Date()
  const map: Record<string, number> = {}
  const labelMap: Record<string, string> = {}

  // initialize all 12 months
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    map[key] = 0
    labelMap[key] = d.toLocaleDateString('fa-IR', { month: 'short' })
  }

  // count users per month
  for (const user of dashboardStore.users) {
    if (!user.createdAt) continue
    const d = new Date(user.createdAt)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    if (key in map) map[key]++
  }

  const categories: string[] = []
  const data: number[] = []
  for (const key of Object.keys(labelMap)) {
    categories.push(labelMap[key]!)
    data.push(map[key] ?? 0)
  }

  return {
    categories,
    series: [{ name: 'کاربران جدید', data }],
  }
})

const chartOptions = computed<ApexOptions>(() => ({
  chart: {
    type: 'area',
    background: 'transparent',
    toolbar: { show: false },
    animations: { enabled: true, speed: 800 },
  },
  theme: { mode: 'dark' },
  colors: ['#38BDF8'],
  fill: {
    type: 'gradient',
    gradient: {
      shade: 'dark',
      type: 'vertical',
      shadeIntensity: 0.3,
      gradientToColors: ['#38BDF8'],
      opacityFrom: 0.6,
      opacityTo: 0.05,
    },
  },
  stroke: { curve: 'smooth', width: 2 },
  grid: { show: false },
  legend: { show: false },
  xaxis: {
    categories: userTrend.value.categories,
    labels: {
      style: { colors: '#A8A29E', fontSize: '12px' },
    },
    axisBorder: { show: false },
    axisTicks: { show: false },
  },
  yaxis: {
    show: true,
    labels: {
      formatter: (val: number) => Math.round(val).toString(),
      style: { colors: '#A8A29E', fontSize: '12px' },
    },
    min: 0,
  },
  dataLabels: { enabled: false },
  tooltip: { theme: 'dark' },
}))
</script>