<template>
  <div class="w-full rounded-2xl border border-[#2A2D36] p-5 space-y-6 shadow-lg shadow-black/30"
    style="background:#1C1E24">
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-5 gap-3">
      <h3 class="text-lg font-semibold text-[#F5F2EB]">چارت فروش</h3>

      <div class="flex items-center gap-2">
        <button v-for="range in ranges" :key="range" type="button"
          class="px-3 py-1.5 text-sm rounded-xl transition-all duration-300" :class="selectedRange === range
            ? 'bg-[#DCF763] text-[#14151A] font-bold'
            : 'bg-[#14151A] text-[#A8A29E] border border-[#2A2D36] hover:text-[#F5F2EB]'
            " @click="selectedRange = range">
          {{ range }}
        </button>
      </div>
    </div>

    <p v-if="chartError" class="text-sm text-rose-300">
      {{ chartError }}
      <button type="button" class="mr-2 underline" @click="fetchSalesChart">تلاش مجدد</button>
    </p>
    <p v-else class="text-sm text-[#A8A29E] mb-3">
      رشد نسبت به دوره قبل:
      <span :class="growthRate > 0 ? 'text-[#7EDCB5]' : growthRate < 0 ? 'text-rose-300' : 'text-[#A8A29E]'"
        class="font-semibold">
        {{ growthRate > 0 ? '+' : '' }}{{ growthRate }}%
      </span>
      <span class="text-[#A8A29E]/70 text-xs mr-2">(از سفارش‌های ثبت‌شده)</span>
    </p>

    <p v-if="chartLoading && !chartError" class="text-sm text-[#A8A29E]">در حال بارگذاری چارت...</p>

    <client-only>
      <ApexChart
        v-if="!chartLoading && !chartError"
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

import { computed, ref, watch, onMounted } from 'vue'
import type { ApexOptions } from 'apexcharts'
import {
  formatChartTooltip,
  formatChartY,
  type ChartRange,
} from '../../utils/orderChartData'


type SalesResponse = {
  categories: string[]
  series: number[]
  growthRate: number
}


type ChartSeries = { name: string; data: number[] }
const series = ref<ChartSeries[]>([{ name: 'فروش', data: [] }])
const rangeToQuery: Record<ChartRange, 'week' | 'month' | 'year'> = {
  هفتگی: 'week',
  ماهانه: 'month',
  سالانه: 'year',
}
const chartLoading = ref(false)
const chartError = ref<string | null>(null)
const growthRate = ref(0)
const categories = ref<string[]>([])
const selectedRange = ref<ChartRange>('هفتگی')
const ranges: ChartRange[] = ['هفتگی', 'ماهانه', 'سالانه']
const ApexChart = defineAsyncComponent(() => import('vue3-apexcharts'))



async function fetchSalesChart() {
  chartLoading.value = true
  chartError.value = null
  try {
    const res = await $fetch<SalesResponse>('/api/dashboard/sales', {
      query: { range: rangeToQuery[selectedRange.value] },
    })
    categories.value = res.categories
    growthRate.value = res.growthRate
    series.value = [{ name: 'فروش', data: res.series }]
  } catch (err: unknown) {
    const fetchErr = err as {
      statusCode?: number
      statusMessage?: string
      data?: { statusMessage?: string; message?: string }
    }
    const detail =
      fetchErr.data?.statusMessage ??
      fetchErr.data?.message ??
      fetchErr.statusMessage
    const code = fetchErr.statusCode ? ` (${fetchErr.statusCode})` : ''
    chartError.value =
      detail?.trim()
        ? `${detail}${code}`
        : `خطا در دریافت آمار فروش${code}. سرور dev روشن است؟ MONGODB_URL در .env درست است؟`
  } finally {
    chartLoading.value = false
  }
}

const chartOptions = computed<ApexOptions>(() => ({
  chart: {
    toolbar: { show: false },
    background: 'transparent',
    animations: { enabled: true, speed: 800 },
  },
  theme: { mode: 'dark' },
  plotOptions: {
    bar: {
      borderRadius: 10,
      borderRadiusApplication: 'end',
      columnWidth: '88%',
      distributed: false,
    },
  },
  colors: ['#8B5CF6'],
  legend: { show: false },
  grid: { show: false },
  fill: {
    type: 'gradient',
    gradient: {
      shade: 'dark',
      type: 'vertical',
      shadeIntensity: 0.4,
      gradientToColors: ['#3B82F6'],
      inverseColors: false,
      opacityFrom: 1,
      opacityTo: 1,
      stops: [0, 100],
    },
  },
  xaxis: {
    categories: categories.value,
    labels: {
      style: { colors: '#A8A29E', fontSize: '13px' },
    },
    axisBorder: { show: false },
    axisTicks: { show: false },
  },
  yaxis: {
    show: true,
    labels: {
      formatter: (val: number) => formatChartY(val),
      style: { colors: '#A8A29E', fontSize: '12px' },
    },
  },
  dataLabels: { enabled: false },
  tooltip: {
    theme: 'dark',
    y: {
      formatter: (val: number) => formatChartTooltip(val),
    },
  },
}))

onMounted(() => {
  fetchSalesChart()
})

watch(selectedRange, () => {
  fetchSalesChart()
})
</script>

<style scoped>
@media (max-width: 640px) {
  .apexcharts-canvas {
    max-height: 250px !important;
  }
}
</style>
