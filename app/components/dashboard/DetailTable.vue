<template>
  <div class="grid grid-cols-1 gap-4 xl:grid-cols-2">
    <section class="rounded-2xl border border-dash-border bg-dash-card p-4 sm:p-5">
      <div class="mb-4 flex items-center justify-between gap-3">
        <h3 class="text-base font-black text-dash-text">آخرین سفارش‌ها</h3>
        <NuxtLink to="/dashboard/orders" class="text-xs font-bold text-dash-accent">
          همه
        </NuxtLink>
      </div>

      <p v-if="dashboardStore.loading" class="py-8 text-center text-sm text-dash-muted">در حال بارگذاری...</p>
      <p v-else-if="latestOrders.length === 0" class="py-8 text-center text-sm text-dash-muted">
        هنوز سفارشی ثبت نشده
      </p>
      <ul v-else class="space-y-3">
        <li
          v-for="order in latestOrders"
          :key="order.id || order._id"
          class="rounded-xl bg-dash-bg px-3 py-3"
        >
          <div class="flex items-start justify-between gap-3">
            <div class="min-w-0">
              <p class="truncate font-bold text-dash-text">{{ order.customerName }}</p>
              <p class="mt-0.5 text-xs text-dash-muted">{{ formatDate(order.createdAt) }}</p>
            </div>
            <span class="shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold" :class="statusClass(order.status)">
              {{ statusLabel(order.status) }}
            </span>
          </div>
          <p class="mt-2 text-sm font-bold text-dash-accent">
            {{ order.amount?.toLocaleString('fa-IR') }} تومان
          </p>
        </li>
      </ul>
    </section>

    <section class="rounded-2xl border border-dash-border bg-dash-card p-4 sm:p-5">
      <div class="mb-4 flex items-center justify-between gap-3">
        <h3 class="text-base font-black text-dash-text">موجودی کم</h3>
        <NuxtLink to="/dashboard/products" class="text-xs font-bold text-rose-300">
          محصولات
        </NuxtLink>
      </div>

      <p v-if="dashboardStore.loading" class="py-8 text-center text-sm text-dash-muted">در حال بارگذاری...</p>
      <p v-else-if="lowStockBooks.length === 0" class="py-8 text-center text-sm text-dash-muted">
        کتاب کم‌موجود نیست
      </p>
      <ul v-else class="space-y-3">
        <li
          v-for="book in lowStockBooks"
          :key="book._id || book.id || book.title"
          class="flex items-center justify-between gap-3 rounded-xl bg-dash-bg px-3 py-3"
        >
          <p class="min-w-0 truncate font-bold text-dash-text">{{ book.title }}</p>
          <span class="shrink-0 rounded-full bg-rose-400/15 px-2.5 py-1 text-[11px] font-bold text-rose-300">
            {{ book.stock ?? 0 }}
          </span>
        </li>
      </ul>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useDashboardStore } from '../../stores/dashboard'
import type { OrderStatus } from '../../../types/dashboard'

const dashboardStore = useDashboardStore()

const latestOrders = computed(() => dashboardStore.latestOrders)
const lowStockBooks = computed(() => dashboardStore.lowStockBooks)

function statusLabel(status: OrderStatus) {
  const map: Record<OrderStatus, string> = {
    pending: 'در انتظار',
    paid: 'پرداخت‌شده',
    failed: 'ناموفق',
    shipped: 'ارسال‌شده',
  }
  return map[status] || status
}

function statusClass(status: OrderStatus) {
  const map: Record<OrderStatus, string> = {
    pending: 'bg-amber-400/15 text-amber-300',
    paid: 'bg-emerald-400/15 text-emerald-300',
    failed: 'bg-rose-400/15 text-rose-300',
    shipped: 'bg-sky-400/15 text-sky-300',
  }
  return map[status] || 'bg-dash-border text-dash-muted'
}

function formatDate(value?: string) {
  if (!value) return '—'
  return new Date(value).toLocaleDateString('fa-IR')
}
</script>
