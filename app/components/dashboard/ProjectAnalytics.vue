<template>
  <div class="w-full rounded-2xl border border-[#2A2D36] p-5 space-y-6 shadow-lg shadow-black/30"
    style="background:#1C1E24">
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-5 gap-3">
      <h3 class="text-lg font-semibold text-[#F5F2EB]">فروش و سفارش</h3>

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
      <span class="text-[#A8A29E]/70 text-xs mr-2">(میله فروش، خط تعداد سفارش)</span>
    </p>

    <p v-if="chartLoading && !chartError" class="text-sm text-[#A8A29E]">در حال بارگذاری چارت...</p>

    <ClientOnly>
      <ComboChart
        v-if="!chartLoading && !chartError"
        :data="comboData"
        x-field="x"
        bar-field="فروش"
        line-field="سفارش"
        :height="300"
        aria-label="نمودار ترکیبی فروش و سفارش"
      />
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue'
import { ComboChart } from '../ui/charts/combo-chart'
import type { ChartRange } from '../../utils/orderChartData'

type SalesResponse = {
  categories: string[]
  series: number[]
  counts?: number[]
  growthRate: number
}

const comboData = ref<Record<string, string | number>[]>([])
const rangeToQuery: Record<ChartRange, 'week' | 'month' | 'year'> = {
  هفتگی: 'week',
  ماهانه: 'month',
  سالانه: 'year',
}
const chartLoading = ref(false)
const chartError = ref<string | null>(null)
const growthRate = ref(0)
const selectedRange = ref<ChartRange>('هفتگی')
const ranges: ChartRange[] = ['هفتگی', 'ماهانه', 'سالانه']

async function fetchSalesChart() {
  chartLoading.value = true
  chartError.value = null
  try {
    const res = await $fetch<SalesResponse>('/api/dashboard/sales', {
      query: { range: rangeToQuery[selectedRange.value] },
    })
    growthRate.value = res.growthRate
    comboData.value = res.categories.map((x, i) => ({
      x,
      فروش: res.series[i] ?? 0,
      سفارش: res.counts?.[i] ?? 0,
    }))
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
    chartError.value = detail?.trim()
      ? `${detail}${code}`
      : `خطا در دریافت آمار فروش${code}`
  } finally {
    chartLoading.value = false
  }
}

onMounted(() => {
  fetchSalesChart()
})

watch(selectedRange, () => {
  fetchSalesChart()
})
</script>
