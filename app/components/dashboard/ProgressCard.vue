<template>
  <div class="space-y-6">
    <h2 class="text-2xl font-bold text-[#F5F2EB]">داشبورد ادمین</h2>

    <div v-if="dashboardStore.loading" class="text-[#A8A29E]">
      در حال بارگذاری...
    </div>

    <div
      v-else-if="dashboardStore.error"
      class="rounded-2xl border border-[#2A2D36] p-5 shadow-lg shadow-black/25"
      style="background:#1C1E24"
    >
      <p class="mb-3 text-rose-300">{{ dashboardStore.error }}</p>
      <button
        type="button"
        class="rounded-xl px-4 py-2 text-sm font-bold text-[#14151A] hover:opacity-90"
        style="background:#DCF763"
        @click="retry"
      >
        تلاش مجدد
      </button>
    </div>

    <template v-else>
      <!-- متریک‌ها -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div
          v-for="(item, index) in dashboardCards"
          :key="item.label"
          class="rounded-2xl p-5 border border-[#2A2D36] shadow-lg shadow-black/30
                 transition duration-300 hover:-translate-y-0.5"
          :style="cardStyle(index)"
        >
          <div class="flex items-start justify-between gap-3">
            <div>
              <h3 class="mb-2 text-sm font-medium text-[#A8A29E]">{{ item.label }}</h3>
              <p class="text-3xl font-bold text-[#F5F2EB]">{{ item.value }}</p>
            </div>
            <span
              class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              :style="iconBg(index)"
            >
              <span class="text-sm font-black" :style="{ color: accentColor(index) }">
                {{ index + 1 }}
              </span>
            </span>
          </div>
          <div
            class="mt-4 h-1 w-full rounded-full overflow-hidden"
            style="background:#2A2D36"
          >
            <div
              class="h-full rounded-full"
              :style="{ width: `${35 + index * 15}%`, background: accentColor(index) }"
            />
          </div>
        </div>
      </div>

      <!-- جداول -->
      <div class="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <section
          class="w-full rounded-2xl border border-[#2A2D36] p-5 shadow-lg shadow-black/30"
          style="background:#1C1E24"
        >
          <div class="mb-4 flex items-center justify-between gap-3">
            <h3 class="text-lg font-bold text-[#F5F2EB]">آخرین سفارش‌ها</h3>
            <span
              class="text-[10px] font-bold tracking-wide px-2.5 py-1 rounded-full"
              style="background:#DCF7631A; color:#DCF763"
            >
              سفارش‌ها
            </span>
          </div>

          <p
            v-if="latestOrders.length === 0"
            class="rounded-xl py-10 text-center text-sm text-[#A8A29E] border border-dashed border-[#2A2D36]"
            style="background:#14151A"
          >
            هنوز سفارشی ثبت نشده است
          </p>

          <div v-else class="overflow-x-auto">
            <table class="w-full min-w-[420px] text-right text-sm">
              <thead>
                <tr class="border-b border-[#2A2D36] text-xs text-[#A8A29E]">
                  <th class="pb-3 font-medium">مشتری</th>
                  <th class="pb-3 font-medium">مبلغ</th>
                  <th class="pb-3 font-medium">وضعیت</th>
                  <th class="pb-3 font-medium">تاریخ</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="order in latestOrders"
                  :key="order.id || order._id"
                  class="border-b border-[#2A2D36]/70 last:border-0"
                >
                  <td class="py-3 font-semibold text-[#F5F2EB]">
                    {{ order.customerName }}
                  </td>
                  <td class="py-3 text-[#A8A29E]">
                    {{ order.amount?.toLocaleString('fa-IR') }} تومان
                  </td>
                  <td class="py-3">
                    <span
                      class="rounded-full px-2.5 py-1 text-xs font-medium"
                      :class="statusClass(order.status)"
                    >
                      {{ statusLabel(order.status) }}
                    </span>
                  </td>
                  <td class="py-3 text-[#A8A29E]">
                    {{ formatDate(order.createdAt) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section
          class="w-full rounded-2xl border border-[#2A2D36] p-5 shadow-lg shadow-black/30"
          style="background:#1C1E24"
        >
          <div class="mb-4 flex items-center justify-between gap-3">
            <h3 class="text-lg font-bold text-[#F5F2EB]">کتاب‌های کم‌موجود</h3>
            <span
              class="text-[10px] font-bold tracking-wide px-2.5 py-1 rounded-full"
              style="background:#FB71851A; color:#FB7185"
            >
              هشدار موجودی
            </span>
          </div>

          <div
            v-if="lowStockBooks.length === 0"
            class="rounded-xl py-10 text-center text-sm text-[#A8A29E] border border-dashed border-[#2A2D36]"
            style="background:#14151A"
          >
            کتاب کم‌موجودی نیست
          </div>

          <div v-else class="overflow-x-auto">
            <table class="w-full min-w-[420px] text-right text-sm">
              <thead>
                <tr class="border-b border-[#2A2D36] text-xs text-[#A8A29E]">
                  <th class="pb-3 font-medium">عنوان</th>
                  <th class="pb-3 font-medium">موجودی</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="book in lowStockBooks"
                  :key="book._id || book.id || book.title"
                  class="border-b border-[#2A2D36]/70 last:border-0"
                >
                  <td class="py-3 font-semibold text-[#F5F2EB]">{{ book.title }}</td>
                  <td class="py-3">
                    <span
                      class="rounded-full px-2.5 py-1 text-xs font-medium
                             bg-rose-400/15 text-rose-300"
                    >
                      {{ book.stock ?? 0 }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { useDashboardStore } from '../../stores/dashboard'
import type { OrderStatus } from '../../../types/dashboard'

const dashboardStore = useDashboardStore()
dashboardStore.fetchDashboardData()

const retry = () => dashboardStore.fetchDashboardData()

const latestOrders = computed(() => dashboardStore.latestOrders)
const lowStockBooks = computed(() => dashboardStore.lowStockBooks)

const dashboardCards = computed(() => [
  { label: 'تعداد کتاب‌ها', value: dashboardStore.totalBooks },
  { label: 'کاربران فعال', value: dashboardStore.totalUsers },
  { label: 'سفارشات امروز', value: dashboardStore.ordersToday },
  { label: 'موجودی کل', value: dashboardStore.totalStock },
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
  return map[status] || 'bg-[#2A2D36] text-[#A8A29E]'
}

function formatDate(value?: string) {
  if (!value) return '—'
  return new Date(value).toLocaleDateString('fa-IR')
}
</script>
