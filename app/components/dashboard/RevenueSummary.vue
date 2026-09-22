<template>
  <div class="w-full rounded-2xl border border-[#2A2D36] p-5 space-y-5 shadow-lg shadow-black/30"
    style="background:#1C1E24">
    <div class="flex items-center justify-between gap-3">
      <h3 class="text-lg font-bold text-[#F5F2EB]">خلاصه درآمد</h3>
      <span class="text-[10px] font-bold tracking-wide px-2.5 py-1 rounded-full"
        style="background:#DCF7631A; color:#DCF763">
        مالی
      </span>
    </div>

    <p v-if="loading" class="text-sm text-[#A8A29E]">در حال بارگذاری...</p>
    <p v-else-if="error" class="text-sm text-rose-300">
      {{ error }}
      <button type="button" class="mr-2 underline" @click="fetchRevenue">تلاش مجدد</button>
    </p>

    <template v-else>
      <!-- main revenue number -->
      <div class="text-center py-3">
        <p class="text-sm text-[#A8A29E] mb-1">درآمد کل</p>
        <p class="text-4xl font-bold text-[#DCF763]">
          {{ (data.totalRevenue || 0).toLocaleString('fa-IR') }}
        </p>
        <p class="text-xs text-[#A8A29E] mt-1">تومان</p>
      </div>

      <!-- growth -->
      <div class="flex items-center justify-center gap-2 text-sm">
        <span class="text-[#A8A29E]">رشد ماهانه:</span>
        <span :class="data.growthRate >= 0 ? 'text-[#7EDCB5]' : 'text-rose-300'" class="font-semibold">
          {{ data.growthRate >= 0 ? '+' : '' }}{{ data.growthRate }}%
        </span>
      </div>

      <!-- mini stats grid -->
      <div class="grid grid-cols-3 gap-3 pt-3 border-t border-[#2A2D36]">
        <div class="text-center">
          <p class="text-xs text-[#A8A29E]">میانگین سفارش</p>
          <p class="text-sm font-bold text-[#F5F2EB]">
            {{ (data.averageOrderValue || 0).toLocaleString('fa-IR') }}
          </p>
        </div>
        <div class="text-center">
          <p class="text-xs text-[#A8A29E]">سفارش‌های موفق</p>
          <p class="text-sm font-bold text-[#F5F2EB]">{{ data.paidOrdersCount || 0 }}</p>
        </div>
        <div class="text-center">
          <p class="text-xs text-[#A8A29E]">درآمد ماه جاری</p>
          <p class="text-sm font-bold text-[#7EDCB5]">
            {{ (data.currentMonthRevenue || 0).toLocaleString('fa-IR') }}
          </p>
        </div>
      </div>

      <!-- mini sparkline chart -->
      <client-only>
        <ApexChart v-if="chartAlive && series.length > 0" type="area" height="120" :options="chartOptions" :series="series" />
      </client-only>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import type { ApexOptions } from 'apexcharts'

type RevenueData = {
  totalRevenue: number
  averageOrderValue: number
  paidOrdersCount: number
  currentMonthRevenue: number
  lastMonthRevenue: number
  growthRate: number
}

const data = ref<RevenueData>({
  totalRevenue: 0,
  averageOrderValue: 0,
  paidOrdersCount: 0,
  currentMonthRevenue: 0,
  lastMonthRevenue: 0,
  growthRate: 0,
})
const loading = ref(true)
const error = ref<string | null>(null)
const ApexChart = defineAsyncComponent(() => import('vue3-apexcharts'))
const chartAlive = ref(true)

const series = computed(() => [
  { name: 'درآمد', data: [data.value.lastMonthRevenue, data.value.currentMonthRevenue] },
])

const chartOptions = computed<ApexOptions>(() => ({
  chart: {
    type: 'area',
    toolbar: { show: false },
    background: 'transparent',
    sparkline: { enabled: true },
    animations: { enabled: false },
  },
  theme: { mode: 'dark' },
  colors: ['#DCF763'],
  fill: {
    type: 'gradient',
    gradient: {
      shade: 'dark',
      type: 'vertical',
      shadeIntensity: 0.3,
      gradientToColors: ['#DCF763'],
      opacityFrom: 0.5,
      opacityTo: 0.05,
    },
  },
  stroke: { curve: 'smooth', width: 2 },
  grid: { show: false },
  legend: { show: false },
  tooltip: {
    theme: 'dark',
    y: {
      formatter: (val: number) => `${val.toLocaleString('fa-IR')} تومان`,
    },
  },
}))

async function fetchRevenue() {
  loading.value = true
  error.value = null
  try {
    data.value = await $fetch<RevenueData>('/api/dashboard/revenue')
  } catch {
    error.value = 'خطا در دریافت آمار درآمد'
  } finally {
    loading.value = false
  }
}

onMounted(fetchRevenue)
onBeforeUnmount(() => {
  chartAlive.value = false
})
</script>