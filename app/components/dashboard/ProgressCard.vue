<template>
  <section class="space-y-4">
    <div class="hidden sm:block">
      <h2 class="text-xl font-black text-dash-text">نمای کلی</h2>
      <p class="mt-1 text-sm text-dash-muted">فروش، سفارش و موجودی همین الان</p>
    </div>

    <div v-if="dashboardStore.loading" class="grid grid-cols-2 gap-3 xl:grid-cols-4">
      <div v-for="n in 4" :key="n" class="h-24 animate-pulse rounded-2xl bg-dash-card" />
    </div>

    <div
      v-else-if="dashboardStore.error"
      class="rounded-2xl border border-dash-border bg-dash-card p-4"
    >
      <p class="mb-3 text-sm text-rose-300">{{ dashboardStore.error }}</p>
      <button
        type="button"
        class="min-h-11 rounded-xl bg-dash-accent px-4 text-sm font-bold text-dash-bg"
        @click="retry"
      >
        تلاش مجدد
      </button>
    </div>

    <div v-else class="grid grid-cols-2 gap-3 xl:grid-cols-4">
      <article
        v-for="item in dashboardCards"
        :key="item.label"
        class="rounded-2xl border border-dash-border bg-dash-card p-4"
      >
        <div class="mb-3 flex h-9 w-9 items-center justify-center rounded-xl" :style="{ background: item.tint }">
          <component :is="item.icon" class="h-4 w-4" :style="{ color: item.color }" />
        </div>
        <p class="text-xs font-bold text-dash-muted">{{ item.label }}</p>
        <p class="mt-1 text-xl font-black text-dash-text sm:text-2xl">{{ item.value }}</p>
        <p v-if="item.hint" class="mt-1 text-[11px] text-dash-muted">{{ item.hint }}</p>
      </article>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { Wallet, ShoppingBag, AlertTriangle, Star } from 'lucide-vue-next'
import { useDashboardStore } from '../../stores/dashboard'

const dashboardStore = useDashboardStore()
dashboardStore.fetchDashboardData()

const retry = () => dashboardStore.fetchDashboardData()

const dashboardCards = computed(() => [
  {
    label: 'فروش',
    value: dashboardStore.totalRevenue.toLocaleString('fa-IR'),
    hint: 'تومان',
    icon: Wallet,
    color: '#DCF763',
    tint: '#DCF76322',
  },
  {
    label: 'سفارش امروز',
    value: dashboardStore.ordersToday.toLocaleString('fa-IR'),
    hint: `${dashboardStore.pendingOrdersCount.toLocaleString('fa-IR')} در انتظار`,
    icon: ShoppingBag,
    color: '#7EDCB5',
    tint: '#7EDCB522',
  },
  {
    label: 'موجودی کم',
    value: dashboardStore.lowStockCount.toLocaleString('fa-IR'),
    hint: 'کمتر از ۵ نسخه',
    icon: AlertTriangle,
    color: '#FB7185',
    tint: '#FB718522',
  },
  {
    label: 'نظرها',
    value: dashboardStore.reviewsTotal.toLocaleString('fa-IR'),
    hint: `میانگین ${dashboardStore.averageRating.toLocaleString('fa-IR')}`,
    icon: Star,
    color: '#38BDF8',
    tint: '#38BDF822',
  },
])
</script>
