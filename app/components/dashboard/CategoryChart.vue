<template>
  <div class="w-full rounded-2xl border border-[#2A2D36] p-5 space-y-5 shadow-lg shadow-black/30"
    style="background:#1C1E24">
    <div class="flex items-center justify-between gap-3">
      <h3 class="text-lg font-bold text-[#F5F2EB]">فروش به تفکیک دسته‌بندی</h3>
      <span class="text-[10px] font-bold tracking-wide px-2.5 py-1 rounded-full"
        style="background:#38BDF81A; color:#38BDF8">
        دسته‌ها
      </span>
    </div>

    <p v-if="chartLoading" class="text-sm text-[#A8A29E]">در حال بارگذاری...</p>
    <p v-else-if="chartError" class="text-sm text-rose-300">
      {{ chartError }}
      <button type="button" class="mr-2 underline" @click="fetchData">تلاش مجدد</button>
    </p>
    <p v-else-if="categories.length === 0" class="text-sm text-[#A8A29E] py-8 text-center">
      داده‌ای برای نمایش وجود ندارد
    </p>

    <client-only>
      <ApexChart
        v-if="chartAlive && !chartLoading && !chartError && categories.length > 0"
        type="donut"
        height="320"
        :options="chartOptions"
        :series="series"
      />
    </client-only>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import type { ApexOptions } from 'apexcharts'
import { formatChartTooltip } from '../../utils/orderChartData'
import { categoryLabel } from '../../utils/categoryLabel'

type CategoryStats = {
  categories: string[]
  series: number[]
  counts: number[]
  totalRevenue: number
}

const categories = ref<string[]>([])
const series = ref<number[]>([])
const chartLoading = ref(true)
const chartError = ref<string | null>(null)
const chartAlive = ref(true)
const ApexChart = defineAsyncComponent(() => import('vue3-apexcharts'))

const palette = ['#DCF763', '#7EDCB5', '#FB7185', '#38BDF8', '#8B5CF6', '#F59E0B', '#EC4899', '#14B8A6']

const chartOptions = computed<ApexOptions>(() => ({
  chart: {
    type: 'donut',
    background: 'transparent',
    animations: { enabled: false },
  },
  theme: { mode: 'dark' },
  labels: categories.value,
  colors: palette.slice(0, categories.value.length),
  legend: {
    position: 'bottom',
    labels: { colors: '#A8A29E' },
    fontFamily: 'Vazir, sans-serif',
    fontSize: '12px',
    itemMargin: { horizontal: 8, vertical: 4 },
  },
  dataLabels: {
    enabled: true,
    formatter: (val: number) => `${Math.round(val)}%`,
    style: { colors: ['#14151A'], fontSize: '12px', fontWeight: 'bold' },
  },
  plotOptions: {
    pie: {
      donut: { size: '55%' },
      expandOnClick: false,
    },
  },
  tooltip: {
    theme: 'dark',
    y: { formatter: (val: number) => formatChartTooltip(val) },
  },
  responsive: [{
    breakpoint: 640,
    options: {
      chart: { height: 250 },
      legend: { position: 'bottom', offsetY: 0 },
    },
  }],
}))

async function fetchData() {
  chartLoading.value = true
  chartError.value = null
  try {
    const res = await $fetch<CategoryStats>('/api/dashboard/category-stats')
    categories.value = res.categories.map((slug) => categoryLabel(slug))
    series.value = res.series
  } catch {
    chartError.value = 'خطا در دریافت آمار دسته‌بندی'
  } finally {
    chartLoading.value = false
  }
}

onMounted(fetchData)
onBeforeUnmount(() => {
  chartAlive.value = false
})
</script>