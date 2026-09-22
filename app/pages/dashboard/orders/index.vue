<template>
  <div class="space-y-4 sm:space-y-6">
    <div class="hidden sm:block">
      <h1 class="text-2xl font-semibold text-dash-text">سفارشات</h1>
    </div>

    <!-- فقط لود اول — موقع refresh کل صفحه خالی نشود -->
    <div v-if="isInitialLoading" class="flex justify-center items-center py-20">
      <span class="w-10 h-10 border-4 border-dash-accent border-t-transparent rounded-full animate-spin" />
    </div>

    <div v-else-if="error" class="py-12 text-center text-rose-300">
      خطا در دریافت سفارشات
      <button type="button" class="underline mr-2" @click="refresh">تلاش مجدد</button>
    </div>

    <template v-else>
      <!-- کارت آمار -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="bg-dash-card border border-dash-border rounded-2xl p-4">
          <p class="text-sm text-dash-muted mb-1">کل سفارشات</p>
          <p class="text-2xl font-bold text-dash-text">{{ totalCount }}</p>
        </div>
        <div class="bg-dash-card border border-dash-border rounded-2xl p-4">
          <p class="text-sm text-dash-muted mb-1">پرداخت نشده</p>
          <p class="text-2xl font-bold text-amber-300">{{ pendingCount }}</p>
        </div>
        <div class="bg-dash-card border border-dash-border rounded-2xl p-4">
          <p class="text-sm text-dash-muted mb-1">پرداخت شده</p>
          <p class="text-2xl font-bold text-dash-accent2">{{ paidCount }}</p>
        </div>
        <div class="bg-dash-card border border-dash-border rounded-2xl p-4">
          <p class="text-sm text-dash-muted mb-1">ارسال شده</p>
          <p class="text-2xl font-bold text-sky-300">{{ shippedCount }}</p>
        </div>
      </div>

      <!-- تب‌ها -->
      <div class="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
        <button v-for="t in tabs" :key="t.key" type="button"
          class="min-h-11 shrink-0 rounded-2xl border px-4 text-sm font-semibold transition" :class="activeTab === t.key
            ? 'bg-dash-accent/15 text-dash-accent border-dash-accent/40'
            : 'bg-dash-card text-dash-muted border-dash-border hover:text-dash-text'
            " @click="activeTab = t.key">
          {{ t.label }}
          <span class="mr-1 opacity-70">({{ tabCount(t.key) }})</span>
        </button>
      </div>

      <!-- جدول -->
      <div class="bg-dash-card border border-dash-border rounded-2xl p-4 sm:p-6 overflow-x-auto">
        <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-5">
          <h2 class="text-lg font-semibold text-dash-text shrink-0">لیست سفارشات</h2>
          <div class="flex flex-col sm:flex-row gap-2 sm:items-center w-full sm:max-w-xl sm:ms-auto">
            <DashboardListSearch v-model="searchTerm" placeholder="جستجو: نام، تلفن، شهر، شماره سفارش..."
              wrapper-class="sm:flex-1 sm:min-w-[12rem]" />
            <button type="button" class="px-4 py-2 h-10 rounded-xl border border-dash-border bg-dash-bg text-dash-text text-sm
                     hover:border-dash-accent/40 transition disabled:opacity-50 shrink-0" :disabled="pending"
              @click="refresh">
              بروزرسانی
            </button>
          </div>
        </div>

        <div v-if="filtered.length === 0" class="py-12 text-center text-dash-muted">
          سفارشی یافت نشد.
        </div>

        <template v-else>
          <ul class="space-y-3 md:hidden">
            <li
              v-for="order in filtered"
              :key="order.id || order._id"
              class="rounded-2xl bg-dash-bg p-4"
              @click="openDetail(order)"
            >
              <div class="flex items-start justify-between gap-3">
                <div class="min-w-0">
                  <p class="font-mono text-xs text-dash-muted">#{{ orderIdShort(order) }}</p>
                  <p class="mt-1 truncate font-bold text-dash-text">{{ order.customerName }}</p>
                  <p class="mt-0.5 text-xs text-dash-muted">{{ formatDate(order.createdAt) }} · {{ order.city || 'بدون شهر' }}</p>
                </div>
                <span class="shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold" :class="statusClass(order.status)">
                  {{ statusLabel(order.status) }}
                </span>
              </div>
              <div class="mt-3 flex items-center justify-between">
                <p class="text-sm font-black text-dash-accent">
                  {{ Number(order.amount || 0).toLocaleString('fa-IR') }} تومان
                </p>
                <span class="text-xs text-dash-muted">{{ order.items?.length || 0 }} قلم</span>
              </div>
            </li>
          </ul>

          <div class="hidden overflow-x-auto md:block">
            <table class="min-w-[800px] w-full border-separate border-spacing-y-2 text-right text-sm text-dash-text">
          <thead>
            <tr class="text-dash-muted">
              <th class="p-3 font-medium">سفارش</th>
              <th class="p-3 font-medium">تاریخ</th>
              <th class="p-3 font-medium">مشتری</th>
              <th class="p-3 font-medium">وضعیت</th>
              <th class="p-3 font-medium">مبلغ</th>
              <th class="p-3 font-medium">شهر</th>
              <th class="p-3 font-medium">اقلام</th>
              <th class="p-3 font-medium">عملیات</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in filtered" :key="order.id || order._id"
              class="bg-dash-bg hover:bg-dash-border/40 transition rounded-xl cursor-pointer"
              @click="openDetail(order)">
              <td class="p-3 font-mono font-semibold">
                #{{ orderIdShort(order) }}
              </td>
              <td class="p-3 text-dash-muted">{{ formatDate(order.createdAt) }}</td>
              <td class="p-3">{{ order.customerName }}</td>
              <td class="p-3">
                <span class="px-2.5 py-1 rounded-full text-xs font-semibold" :class="statusClass(order.status)">
                  {{ statusLabel(order.status) }}
                </span>
              </td>
              <td class="p-3 font-bold text-dash-accent">
                {{ Number(order.amount || 0).toLocaleString('fa-IR') }} تومان
              </td>
              <td class="p-3 text-dash-muted">{{ order.city || '—' }}</td>
              <td class="p-3">{{ order.items?.length || 0 }} مورد</td>
              <td class="p-3" @click.stop>
                <button type="button" class="text-dash-accent hover:opacity-80 text-sm font-semibold"
                  @click="openDetail(order)">
                  مشاهده
                </button>
              </td>
            </tr>
          </tbody>
        </table>
          </div>
        </template>
      </div>
    </template>

    <!-- مودال جزئیات — خارج از کارت جدول -->
    <Teleport to="body">
      <div v-if="showDetail && selected" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60"
        @click.self="closeDetail">
        <div class="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-dash-card border border-dash-border
                 rounded-2xl p-6 text-dash-text shadow-xl">
          <div class="flex items-start justify-between gap-3 mb-6">
            <div>
              <h3 class="text-lg font-semibold">جزئیات سفارش</h3>
              <p class="font-mono text-dash-muted text-sm mt-1">#{{ orderIdShort(selected) }}</p>
            </div>
            <button type="button"
              class="w-8 h-8 rounded-lg text-dash-muted hover:text-dash-text hover:bg-dash-border/50 transition"
              aria-label="بستن" @click="closeDetail">
              ✕
            </button>
          </div>

          <!-- سفارش -->
          <section class="mb-5">
            <h4 class="text-sm font-semibold text-dash-accent mb-3">اطلاعات سفارش</h4>
            <div class="grid grid-cols-2 gap-3 text-sm">
              <div class="bg-dash-bg rounded-xl p-3 border border-dash-border">
                <p class="text-dash-muted text-xs mb-1">تاریخ</p>
                <p>{{ formatDate(selected.createdAt) }}</p>
              </div>
              <div class="bg-dash-bg rounded-xl p-3 border border-dash-border">
                <p class="text-dash-muted text-xs mb-1">وضعیت</p>
                <span class="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold"
                  :class="statusClass(selected.status)">
                  {{ statusLabel(selected.status) }}
                </span>
              </div>
              <div class="bg-dash-bg rounded-xl p-3 border border-dash-border">
                <p class="text-dash-muted text-xs mb-1">مبلغ</p>
                <p class="font-bold text-dash-accent">
                  {{ Number(selected.amount || 0).toLocaleString('fa-IR') }} تومان
                </p>
              </div>
              <div class="bg-dash-bg rounded-xl p-3 border border-dash-border">
                <p class="text-dash-muted text-xs mb-1">روش پرداخت</p>
                <p>{{ selected.paymentMethod === 'cod' ? 'پرداخت در محل' : 'آنلاین' }}</p>
              </div>
            </div>

            <!-- وضعیت  -->
            <div class="mt-4 space-y-2">
              <label class="text-xs text-dash-muted">تغییر وضعیت</label>
              <div class="flex flex-col sm:flex-row gap-2 sm:items-center">
                <select v-model="editStatus"
                  class="flex-1 px-3 py-2 rounded-xl border border-dash-border bg-dash-bg text-dash-text text-sm">
                  <option value="pending">پرداخت نشده</option>
                  <option value="paid">پرداخت شده</option>
                  <option value="shipped">بسته شده</option>
                  <option value="failed">ناموفق</option>
                </select>
                <button type="button"
                  class="px-4 py-2 rounded-xl bg-dash-accent text-dash-bg text-sm font-bold disabled:opacity-50"
                  :disabled="savingStatus || editStatus === selected.status" @click="saveStatus">
                  {{ savingStatus ? 'در حال ذخیره...' : 'ذخیره وضعیت' }}
                </button>
              </div>
              <p v-if="statusError" class="text-sm text-rose-300">{{ statusError }}</p>
            </div>
          </section>

          <!-- مشتری -->
          <section class="mb-5 border-t border-dash-border pt-5">
            <h4 class="text-sm font-semibold text-dash-accent mb-3">اطلاعات مشتری</h4>
            <div class="space-y-2 text-sm">
              <p class="text-dash-muted">
                نام:
                <span class="text-dash-text font-medium">{{ selected.customerName }}</span>
              </p>
              <p class="text-dash-muted">
                تلفن:
                <span class="text-dash-text font-medium dir-ltr inline-block">{{ selected.phone || '—' }}</span>
              </p>
            </div>
          </section>

          <!-- ارسال -->
          <section class="mb-5 border-t border-dash-border pt-5">
            <h4 class="text-sm font-semibold text-dash-accent mb-3">اطلاعات ارسال</h4>
            <div class="space-y-2 text-sm">
              <p class="text-dash-muted">
                شهر: <span class="text-dash-text font-medium">{{ selected.city || '—' }}</span>
              </p>
              <p class="text-dash-muted">
                آدرس: <span class="text-dash-text font-medium">{{ selected.address || '—' }}</span>
              </p>
              <p class="text-dash-muted">
                کد پستی:
                <span class="text-dash-text font-medium">{{ selected.postalCode || '—' }}</span>
              </p>
            </div>
          </section>

          <!-- محصولات -->
          <section class="border-t border-dash-border pt-5">
            <h4 class="text-sm font-semibold text-dash-accent mb-3">محصولات</h4>
            <ul v-if="selected.items?.length" class="space-y-3">
              <li v-for="(item, idx) in selected.items" :key="idx"
                class="flex items-center gap-3 bg-dash-bg rounded-xl p-3 border border-dash-border">
                <div class="w-12 h-16 rounded-lg shrink-0 bg-dash-border flex items-center justify-center
                         text-dash-muted text-[10px] text-center px-1">
                  کتاب
                </div>
                <div class="min-w-0 flex-1">
                  <p class="font-semibold text-sm truncate">{{ item.title }}</p>
                  <p class="text-xs text-dash-muted mt-1">
                    {{ item.quantity }} ×
                    {{ Number(item.price || 0).toLocaleString('fa-IR') }} تومان
                  </p>
                </div>
                <p class="text-sm font-bold text-dash-text shrink-0">
                  {{ Number((item.price || 0) * (item.quantity || 1)).toLocaleString('fa-IR') }}
                </p>
              </li>
            </ul>
            <p v-else class="text-sm text-dash-muted">آیتمی ثبت نشده.</p>
          </section>

          <div class="mt-6 flex justify-end">
            <button type="button"
              class="px-4 py-2 rounded-xl bg-dash-border text-dash-text text-sm hover:opacity-90 transition"
              @click="closeDetail">
              بستن
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { formatDate } from '../../../utils/formatDate'
import type { Order } from '~/types/dashboard'

definePageMeta({ layout: 'dashboard', title: 'سفارشات' })

const route = useRoute()

// as any: جلوگیری از Excessive stack depth روی تایپ‌های Nuxt $fetch/useFetch
const { data, pending, error, refresh } = await (useFetch as any)('/api/orders', {
  query: { limit: 50 },
  credentials: 'include',
})

const orders = computed((): Order[] => (Array.isArray(data.value) ? (data.value as Order[]) : []))
/** اسپینر تمام‌صفحه فقط وقتی هنوز هیچ داده‌ای نیست */
const isInitialLoading = computed(() => Boolean(pending.value) && !data.value)
const searchTerm = ref('')

onMounted(() => {
  const q = typeof route.query.q === 'string' ? route.query.q : ''
  if (q) searchTerm.value = q
})

const tabs = [
  { key: 'all', label: 'همه' },
  { key: 'pending', label: 'پرداخت نشده' },
  { key: 'paid', label: 'پرداخت شده' },
  { key: 'shipped', label: 'بسته شده' },
  { key: 'failed', label: 'ناموفق' },
]

const activeTab = ref('all')

const filtered = computed(() => {
  let list = orders.value
  if (activeTab.value !== 'all') {
    list = list.filter((o) => o.status === activeTab.value)
  }

  const q = searchTerm.value.trim().toLowerCase()
  if (!q) return list

  return list.filter((o) => {
    const id = (o.id || o._id || '').toString().toLowerCase()
    const name = (o.customerName || '').toLowerCase()
    const phone = (o.phone || '').toString()
    const city = (o.city || '').toLowerCase()
    return (
      id.includes(q) ||
      name.includes(q) ||
      phone.includes(q) ||
      city.includes(q)
    )
  })
})

const totalCount = computed(() => orders.value.length)
const pendingCount = computed(() => orders.value.filter((o) => o.status === 'pending').length)
const paidCount = computed(() => orders.value.filter((o) => o.status === 'paid').length)
const shippedCount = computed(() => orders.value.filter((o) => o.status === 'shipped').length)

const selected = ref<Order | null>(null)
const showDetail = ref(false)
const editStatus = ref<Order['status']>('pending')
const savingStatus = ref(false)
const statusError = ref('')

function tabCount(key: string) {
  if (key === 'all') return orders.value.length
  return orders.value.filter((o) => o.status === key).length
}

function orderIdShort(order: Order) {
  return (order?.id || order?._id || '').toString().slice(-6)
}

function openDetail(order: Order) {
  selected.value = order
  editStatus.value = order.status
  statusError.value = ''
  showDetail.value = true
}

function closeDetail() {
  showDetail.value = false
  selected.value = null
  statusError.value = ''
}

async function saveStatus() {
  if (!selected.value) return
  savingStatus.value = true
  statusError.value = ''

  try {
    const id = selected.value.id || selected.value._id
    await ($fetch as any)(`/api/orders/${id}`, {
      method: 'PUT',
      body: { status: editStatus.value },
      credentials: 'include',
    })

    await refresh()
    selected.value = { ...selected.value, status: editStatus.value }

  } catch {
    statusError.value = 'ذخیره وضعیت ناموفق بود'
  } finally {
    savingStatus.value = false
  }

}

function statusLabel(status: string) {
  const map: Record<string, string> = {
    pending: 'پرداخت نشده',
    paid: 'پرداخت شده',
    shipped: 'بسته شده',
    failed: 'ناموفق',
  }
  return map[status] || status
}

function statusClass(status: string) {
  switch (status) {
    case 'paid':
      return 'bg-dash-accent2/15 text-dash-accent2'
    case 'pending':
      return 'bg-amber-400/15 text-amber-300'
    case 'shipped':
      return 'bg-sky-400/15 text-sky-300'
    case 'failed':
      return 'bg-rose-400/15 text-rose-300'
    default:
      return 'bg-dash-border text-dash-muted'
  }
}
</script>
