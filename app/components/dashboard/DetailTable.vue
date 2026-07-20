<template>

    <div class="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <section class="w-full rounded-2xl border border-[#2A2D36] p-5 shadow-lg shadow-black/30"
            style="background:#1C1E24">
            <div class="mb-4 flex items-center justify-between gap-3">
                <h3 class="text-lg font-bold text-[#F5F2EB]">آخرین سفارش‌ها</h3>
                <span class="text-[10px] font-bold tracking-wide px-2.5 py-1 rounded-full"
                    style="background:#DCF7631A; color:#DCF763">
                    سفارش‌ها
                </span>
            </div>

            <p v-if="dashboardStore.loading"
                class="rounded-xl py-10 text-center text-sm text-[#A8A29E] border border-dashed border-[#2A2D36]"
                style="background:#14151A">
                در حال بارگذاری...</p>

            <p v-else-if="latestOrders.length === 0"
                class="rounded-xl py-10 text-center text-sm text-[#A8A29E] border border-dashed border-[#2A2D36]"
                style="background:#14151A">
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
                        <tr v-for="order in latestOrders" :key="order.id || order._id"
                            class="border-b border-[#2A2D36]/70 last:border-0">
                            <td class="py-3 font-semibold text-[#F5F2EB]">
                                {{ order.customerName }}
                            </td>
                            <td class="py-3 text-[#A8A29E]">
                                {{ order.amount?.toLocaleString('fa-IR') }} تومان
                            </td>
                            <td class="py-3">
                                <span class="rounded-full px-2.5 py-1 text-xs font-medium"
                                    :class="statusClass(order.status)">
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

        <section class="w-full rounded-2xl border border-[#2A2D36] p-5 shadow-lg shadow-black/30"
            style="background:#1C1E24">
            <div class="mb-4 flex items-center justify-between gap-3">
                <h3 class="text-lg font-bold text-[#F5F2EB]">کتاب‌های کم‌موجود</h3>
                <span class="text-[10px] font-bold tracking-wide px-2.5 py-1 rounded-full"
                    style="background:#FB71851A; color:#FB7185">
                    هشدار موجودی
                </span>
            </div>

            <div v-if="dashboardStore.loading"
                class="rounded-xl py-10 text-center text-sm text-[#A8A29E] border border-dashed border-[#2A2D36]">در حال
                بارگذاری...</div>

            <div v-else-if="lowStockBooks.length === 0"
                class="rounded-xl py-10 text-center text-sm text-[#A8A29E] border border-dashed border-[#2A2D36]"
                style="background:#14151A">
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
                        <tr v-for="book in lowStockBooks" :key="book._id || book.id || book.title"
                            class="border-b border-[#2A2D36]/70 last:border-0">
                            <td class="py-3 font-semibold text-[#F5F2EB]">{{ book.title }}</td>
                            <td class="py-3">
                                <span class="rounded-full px-2.5 py-1 text-xs font-medium
                             bg-rose-400/15 text-rose-300">
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

<script setup lang="ts">
import { useDashboardStore } from '../../stores/dashboard'
import type { OrderStatus } from '../../../types/dashboard'

const dashboardStore = useDashboardStore()

const latestOrders = computed(() => dashboardStore.latestOrders)
const lowStockBooks = computed(() => dashboardStore.lowStockBooks)

const accents = ['#DCF763', '#7EDCB5', '#FB7185', '#38BDF8']


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