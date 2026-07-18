<template>
  <div class="space-y-6">
    <h2 class="text-2xl font-bold text-gray-800">داشبورد ادمین</h2>

    <div v-if="dashboardStore.loading" class="text-gray-500">
      در حال بارگذاری...
    </div>

    <div v-else-if="dashboardStore.error" class="rounded-2xl bg-white p-5 shadow-sm">
      <p class="mb-3 text-red-600">{{ dashboardStore.error }}</p>
      <button
        type="button"
        class="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white"
        @click="retry"
      >
        تلاش مجدد
      </button>
    </div>

    <template v-else>
      <div class="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <div
          v-for="item in dashboardCards"
          :key="item.label"
          class="rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 p-6 text-white shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-lg"
        >
          <h3 class="mb-2 font-medium">{{ item.label }}</h3>
          <p class="text-3xl font-bold">{{ item.value }}</p>
        </div>
      </div>

      <section class="w-full rounded-2xl bg-white p-5 shadow-sm lg:w-2/3">
        <div class="mb-4 flex items-center justify-between">
          <h3 class="text-lg font-bold text-gray-800">آخرین سفارش‌ها</h3>
          <NuxtLink
            to="/dashboard/invoice"
            class="text-sm font-medium text-blue-600 hover:underline"
          >
            مشاهده همه
          </NuxtLink>
        </div>

        <p v-if="latestOrders.length === 0" class="text-sm text-gray-400">
          هنوز سفارشی ثبت نشده است
        </p>

        <div v-else class="overflow-x-auto">
          <table class="w-full min-w-[420px] text-right text-sm">
            <thead>
              <tr class="border-b border-gray-100 text-xs text-gray-400">
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
                class="border-b border-gray-50 transition hover:bg-blue-50 last:border-0"
              >
                <td class="py-3 font-semibold text-gray-800">
                  {{ order.customerName }}
                </td>
                <td class="py-3 text-gray-600">
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
                <td class="py-3 text-gray-500">
                  {{ formatDate(order.createdAt) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
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

const dashboardCards = computed(() => [
  { label: 'تعداد کتاب‌ها', value: dashboardStore.totalBooks },
  { label: 'کاربران فعال', value: dashboardStore.totalUsers },
  { label: 'سفارشات امروز', value: dashboardStore.ordersToday },
  { label: 'موجودی کل', value: dashboardStore.totalStock },
])

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
    pending: 'bg-amber-50 text-amber-700',
    paid: 'bg-emerald-50 text-emerald-700',
    failed: 'bg-rose-50 text-rose-700',
    shipped: 'bg-blue-50 text-blue-700',
  }
  return map[status] || 'bg-gray-50 text-gray-600'
}

function formatDate(value?: string) {
  if (!value) return '—'
  return new Date(value).toLocaleDateString('fa-IR')
}
</script>
