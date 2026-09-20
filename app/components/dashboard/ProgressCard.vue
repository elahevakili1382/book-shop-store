<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-2xl font-bold text-[#F5F2EB]">نمای کلی کتاب‌فروشی</h2>
      <p class="mt-1 text-sm text-[#A8A29E]">فروش، سفارش، موجودی و نظر مشتری‌ها</p>
    </div>

    <div v-if="dashboardStore.loading" class="text-[#A8A29E]">
      در حال بارگذاری...
    </div>

    <div v-else-if="dashboardStore.error" class="rounded-2xl border border-[#2A2D36] p-5 shadow-lg shadow-black/25"
      style="background:#1C1E24">
      <p class="mb-3 text-rose-300">{{ dashboardStore.error }}</p>
      <button type="button" class="rounded-xl px-4 py-2 text-sm font-bold text-[#14151A] hover:opacity-90"
        style="background:#DCF763" @click="retry">
        تلاش مجدد
      </button>
    </div>

    <template v-else>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div v-for="(item, index) in dashboardCards" :key="item.label" class="rounded-2xl p-5 border border-[#2A2D36] shadow-lg shadow-black/30
                 transition duration-300 hover:-translate-y-0.5" :style="cardStyle(index)">
          <div class="flex items-start justify-between gap-3">
            <div>
              <h3 class="mb-2 text-sm font-medium text-[#A8A29E]">{{ item.label }}</h3>
              <p class="text-3xl font-bold text-[#F5F2EB]">{{ item.value }}</p>
              <p v-if="item.hint" class="mt-1 text-xs text-[#A8A29E]">{{ item.hint }}</p>
            </div>
            <span class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" :style="iconBg(index)">
              <span class="text-sm font-black" :style="{ color: accentColor(index) }">
                {{ index + 1 }}
              </span>
            </span>
          </div>
          <div class="mt-4 h-1 w-full rounded-full overflow-hidden" style="background:#2A2D36">
            <div class="h-full rounded-full"
              :style="{ width: `${35 + index * 15}%`, background: accentColor(index) }" />
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { useDashboardStore } from '../../stores/dashboard'

const dashboardStore = useDashboardStore()
dashboardStore.fetchDashboardData()

const retry = () => dashboardStore.fetchDashboardData()

const dashboardCards = computed(() => [
  {
    label: 'فروش',
    value: `${dashboardStore.totalRevenue.toLocaleString('fa-IR')}`,
    hint: 'تومان از سفارش‌های موفق',
  },
  {
    label: 'سفارش',
    value: dashboardStore.ordersToday.toLocaleString('fa-IR'),
    hint: `${dashboardStore.pendingOrdersCount.toLocaleString('fa-IR')} در انتظار پرداخت`,
  },
  {
    label: 'موجودی کم',
    value: dashboardStore.lowStockCount.toLocaleString('fa-IR'),
    hint: 'کمتر از ۵ نسخه',
  },
  {
    label: 'نظرها',
    value: dashboardStore.reviewsTotal.toLocaleString('fa-IR'),
    hint: `میانگین امتیاز ${dashboardStore.averageRating.toLocaleString('fa-IR')}`,
  },
])

const accents = ['#DCF763', '#7EDCB5', '#FB7185', '#38BDF8']

function accentColor(index: number) {
  return accents[index % accents.length]!
}

function cardStyle(index: number) {
  return {
    background: '#1C1E24',
    borderTop: `3px solid ${accentColor(index)}`,
  }
}

function iconBg(index: number) {
  return { background: `${accentColor(index)}22` }
}
</script>
