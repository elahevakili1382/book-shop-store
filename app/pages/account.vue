<template>
  <main class="min-h-screen pb-28 lg:pb-16">
    <div class="mx-auto max-w-[960px] px-4 py-10 sm:px-8">
      <p class="text-xs font-bold text-slate/45">حساب مشتری</p>
      <h1 class="mt-2 text-2xl font-black text-slate sm:text-3xl">پنل کاربری</h1>
      <p class="mt-2 text-sm text-slate/55">سفارش‌ها، اطلاعات و آدرس‌هایت اینجاست.</p>

      <div class="mt-8 grid gap-6">
        <section class="rounded-[1.5rem] border border-slate/8 bg-white p-5 shadow-card sm:p-6">
          <h2 class="text-lg font-black text-slate">اطلاعات کاربری</h2>
          <form class="mt-5 grid gap-3 sm:grid-cols-2" @submit.prevent="saveProfile">
            <label class="block text-sm font-bold text-slate">
              نام
              <input
                v-model="profile.name"
                type="text"
                required
                class="mt-1.5 w-full rounded-2xl border border-slate/10 bg-cream/40 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-lime/60"
              />
            </label>
            <label v-if="!isPlaceholderEmail(profile.email)" class="block text-sm font-bold text-slate">
              ایمیل
              <input
                :value="profile.email"
                type="email"
                disabled
                class="mt-1.5 w-full rounded-2xl border border-slate/10 bg-cream px-4 py-3 text-sm text-slate/50"
              />
            </label>
            <label class="block text-sm font-bold text-slate sm:col-span-2">
              موبایل
              <input
                v-model="profile.phone"
                type="tel"
                dir="ltr"
                class="mt-1.5 w-full rounded-2xl border border-slate/10 bg-cream/40 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-lime/60"
                placeholder="09121234567"
              />
            </label>
            <button
              type="submit"
              :disabled="savingProfile"
              class="sm:col-span-2 rounded-2xl bg-slate py-3 text-sm font-bold text-white hover:bg-lime hover:text-slate disabled:opacity-50"
            >
              ذخیره اطلاعات
            </button>
          </form>
        </section>

        <section class="rounded-[1.5rem] border border-slate/8 bg-white p-5 shadow-card sm:p-6">
          <h2 class="text-lg font-black text-slate">آدرس‌ها</h2>
          <form class="mt-5 grid gap-3" @submit.prevent="saveProfile">
            <label class="block text-sm font-bold text-slate">
              شهر
              <input
                v-model="profile.city"
                type="text"
                class="mt-1.5 w-full rounded-2xl border border-slate/10 bg-cream/40 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-lime/60"
              />
            </label>
            <label class="block text-sm font-bold text-slate">
              کد پستی
              <input
                v-model="profile.postalCode"
                type="text"
                dir="ltr"
                class="mt-1.5 w-full rounded-2xl border border-slate/10 bg-cream/40 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-lime/60"
              />
            </label>
            <label class="block text-sm font-bold text-slate">
              آدرس کامل
              <textarea
                v-model="profile.address"
                rows="3"
                class="mt-1.5 w-full rounded-2xl border border-slate/10 bg-cream/40 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-lime/60"
              />
            </label>
            <button
              type="submit"
              :disabled="savingProfile"
              class="rounded-2xl bg-slate py-3 text-sm font-bold text-white hover:bg-lime hover:text-slate disabled:opacity-50"
            >
              ذخیره آدرس
            </button>
          </form>
        </section>

        <section class="rounded-[1.5rem] border border-slate/8 bg-white p-5 shadow-card sm:p-6">
          <h2 class="text-lg font-black text-slate">پیگیری سفارش</h2>
          <p v-if="ordersPending" class="mt-4 text-sm text-slate/45">در حال بارگذاری سفارش‌ها...</p>
          <p v-else-if="!orders.length" class="mt-4 text-sm leading-relaxed text-slate/50">
            هنوز سفارشی با این حساب ثبت نشده. بعد از ورود، سفارش‌های جدید اینجا می‌آیند.
          </p>
          <ul v-else class="mt-4 space-y-3">
            <li
              v-for="order in orders"
              :key="order.id"
              class="rounded-2xl border border-slate/8 bg-cream/50 p-4"
            >
              <div class="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p class="text-sm font-black text-slate">
                    سفارش {{ order.id.slice(-6).toUpperCase() }}
                  </p>
                  <p class="mt-1 text-xs text-slate/45">{{ formatDate(order.createdAt) }}</p>
                </div>
                <span class="rounded-full bg-lime/40 px-2.5 py-1 text-[11px] font-bold text-slate">
                  {{ statusLabel(order.status) }}
                </span>
              </div>
              <ul class="mt-3 space-y-1 text-sm text-slate/70">
                <li v-for="(item, index) in order.items" :key="`${order.id}-${index}`">
                  {{ item.title }} × {{ item.quantity.toLocaleString('fa-IR') }}
                </li>
              </ul>
              <p class="mt-3 text-sm font-black text-slate">
                {{ formatPrice(order.amount) }}
                <span class="text-xs font-bold text-slate/40">تومان</span>
              </p>
              <p v-if="order.city || order.address" class="mt-1 text-xs text-slate/50">
                {{ [order.city, order.address].filter(Boolean).join('، ') }}
              </p>
            </li>
          </ul>
        </section>

        <button
          type="button"
          class="rounded-2xl border border-slate/15 bg-white py-3 text-sm font-bold text-slate hover:bg-cream"
          @click="auth.logout()"
        >
          خروج از حساب
        </button>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue'
import { isPlaceholderEmail } from '../utils/digits'

definePageMeta({
  layout: 'default',
  middleware: 'auth',
})

useSeoMeta({
  title: 'پنل کاربری | Booklett',
  description: 'مشاهده سفارش‌ها، اطلاعات کاربری و آدرس‌ها.',
})

const auth = useAuthStore()
const toast = useToast()
const savingProfile = ref(false)

type AccountUser = {
  name: string
  email: string
  phone: string
  address: string
  city: string
  postalCode: string
}

type AccountOrder = {
  id: string
  status: string
  amount: number
  city?: string
  address?: string
  createdAt?: string
  items: { title: string; quantity: number }[]
}

const profile = reactive<AccountUser>({
  name: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  postalCode: '',
})

const { data: me } = await useAsyncData('account-me', () => $fetch<{ ok: boolean; user: AccountUser | null }>('/api/user'))
if (me.value?.user) {
  Object.assign(profile, me.value.user)
}

const { data: orderRes, pending: ordersPending } = await useAsyncData('account-orders', () =>
  $fetch<{ ok: boolean; orders: AccountOrder[] }>('/api/orders/mine'),
)

const orders = computed(() => orderRes.value?.orders ?? [])

async function saveProfile() {
  savingProfile.value = true
  try {
    const res = await $fetch<{ ok: boolean; user: AccountUser }>('/api/user', {
      method: 'PUT',
      body: { ...profile },
    })
    if (res?.user) {
      Object.assign(profile, res.user)
      auth.setUser({
        ...auth.user,
        id: auth.user?.id || '',
        name: res.user.name,
        email: res.user.email,
        role: auth.user?.role,
      })
    }
    toast.success({ message: 'ذخیره شد', position: 'topRight', timeout: 1800 })
  } catch (err: any) {
    toast.error(err?.data?.statusMessage || 'ذخیره نشد')
  } finally {
    savingProfile.value = false
  }
}

function statusLabel(status: string) {
  const map: Record<string, string> = {
    pending: 'در انتظار پرداخت / آماده‌سازی',
    paid: 'پرداخت شده',
    failed: 'ناموفق',
    shipped: 'ارسال شده',
  }
  return map[status] || status
}

function formatPrice(value: number) {
  return new Intl.NumberFormat('fa-IR').format(value || 0)
}

function formatDate(value?: string) {
  if (!value) return ''
  return new Date(value).toLocaleDateString('fa-IR')
}
</script>
