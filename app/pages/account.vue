<template>
  <main class="min-h-screen pb-28 lg:pb-16">
    <div class="mx-auto max-w-[1100px] px-4 py-6 sm:px-8 sm:py-8">
      <p class="text-xs font-bold text-slate/45">حساب مشتری</p>
      <h1 class="mt-2 text-xl font-black text-slate sm:text-3xl">پنل کاربری</h1>
      <p class="mt-2 text-sm text-slate/55">
        {{ auth.user?.name ? `${auth.user.name}، بخش‌های حساب اینجاست.` : 'سفارش‌ها، اطلاعات و تنظیمات اینجاست.' }}
      </p>

      <div class="mt-6 grid gap-5 lg:grid-cols-[16.5rem_minmax(0,1fr)] lg:items-start">
        <aside class="rounded-[1.5rem] border border-slate/8 bg-white p-3 shadow-card lg:sticky lg:top-24">
          <nav class="flex flex-col gap-1" aria-label="بخش‌های پنل کاربری">
            <button
              v-for="item in menu"
              :key="item.id"
              type="button"
              class="flex min-h-11 items-center gap-3 rounded-2xl px-3 text-sm font-bold transition-colors"
              :class="active === item.id ? 'bg-slate text-white' : 'text-slate/70 hover:bg-cream hover:text-slate'"
              @click="active = item.id"
            >
              <AppIcon :icon="item.icon" class="h-5 w-5 shrink-0" />
              {{ item.label }}
            </button>
            <NuxtLink
              v-if="isAdmin"
              to="/dashboard"
              class="mt-2 flex min-h-11 items-center gap-3 rounded-2xl bg-lime px-3 text-sm font-bold text-slate"
            >
              <AppIcon icon="mdi:view-dashboard-outline" class="h-5 w-5 shrink-0" />
              مشاهده داشبورد
            </NuxtLink>
            <button
              type="button"
              class="mt-1 flex min-h-11 items-center gap-3 rounded-2xl px-3 text-sm font-bold text-red-600 hover:bg-red-50"
              @click="auth.logout()"
            >
              <AppIcon icon="mdi:logout" class="h-5 w-5 shrink-0" />
              خروج
            </button>
          </nav>
        </aside>

        <div class="min-w-0">
          <section v-if="active === 'orders'" class="rounded-[1.5rem] border border-slate/8 bg-white p-5 shadow-card sm:p-6">
            <h2 class="text-base font-black text-slate sm:text-lg">سفارش‌های من</h2>
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

          <section v-else-if="active === 'wishlist'" class="rounded-[1.5rem] border border-slate/8 bg-white p-5 shadow-card sm:p-6">
            <h2 class="text-base font-black text-slate sm:text-lg">کالاهای مورد علاقه</h2>
            <p v-if="wishlistPending" class="mt-4 text-sm text-slate/45">در حال بارگذاری...</p>
            <p v-else-if="!wishlistProducts.length" class="mt-4 text-sm leading-relaxed text-slate/50">
              هنوز کتابی ذخیره نشده. از صفحه محصول، قلب را بزن تا اینجا جمع شود.
            </p>
            <ProductGrid v-else class="mt-5" :products="wishlistProducts" />
          </section>

          <section v-else-if="active === 'reviews'" class="rounded-[1.5rem] border border-slate/8 bg-white p-5 shadow-card sm:p-6">
            <h2 class="text-base font-black text-slate sm:text-lg">نظرات</h2>
            <p v-if="reviewsPending" class="mt-4 text-sm text-slate/45">در حال بارگذاری نظرها...</p>
            <p v-else-if="!myReviews.length" class="mt-4 text-sm leading-relaxed text-slate/50">
              هنوز نظری ثبت نکرده‌ای. بعد از خرید می‌توانی روی صفحه محصول نظرت را بنویسی.
            </p>
            <ul v-else class="mt-4 space-y-3">
              <li
                v-for="review in myReviews"
                :key="review.id"
                class="rounded-2xl border border-slate/8 bg-cream/50 p-4"
              >
                <div class="flex flex-wrap items-start justify-between gap-2">
                  <NuxtLink :to="`/product/${review.bookSlug}`" class="text-sm font-black text-slate hover:text-slate/70">
                    {{ review.bookTitle }}
                  </NuxtLink>
                  <span class="text-xs font-bold text-slate/45">{{ review.rating.toLocaleString('fa-IR') }} از ۵</span>
                </div>
                <p class="mt-2 text-sm leading-relaxed text-slate/65">{{ review.comment }}</p>
                <p class="mt-2 text-xs text-slate/40">{{ formatDate(review.createdAt) }}</p>
              </li>
            </ul>
          </section>

          <section v-else-if="active === 'address'" class="rounded-[1.5rem] border border-slate/8 bg-white p-5 shadow-card sm:p-6">
            <h2 class="text-base font-black text-slate sm:text-lg">نشانی‌ها</h2>
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
                نشانی کامل
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
                ذخیره نشانی
              </button>
            </form>
          </section>

          <section v-else-if="active === 'profile'" class="rounded-[1.5rem] border border-slate/8 bg-white p-5 shadow-card sm:p-6">
            <h2 class="text-base font-black text-slate sm:text-lg">مشخصات فردی</h2>
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
                class="rounded-2xl bg-slate py-3 text-sm font-bold text-white hover:bg-lime hover:text-slate disabled:opacity-50 sm:col-span-2"
              >
                ذخیره مشخصات
              </button>
            </form>
          </section>

          <section v-else class="rounded-[1.5rem] border border-slate/8 bg-white p-5 shadow-card sm:p-6">
            <h2 class="text-base font-black text-slate sm:text-lg">کیف پول</h2>
            <p class="mt-2 text-sm text-slate/50">موجودی قابل استفاده برای سفارش‌های بعدی.</p>
            <p class="mt-6 text-2xl font-black text-slate sm:text-3xl">
              {{ formatPrice(walletBalance) }}
              <span class="text-sm font-bold text-slate/40">تومان</span>
            </p>

            <p class="mt-6 text-sm font-bold text-slate">مبلغ شارژ</p>
            <div class="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
              <button
                v-for="amount in chargePresets"
                :key="amount"
                type="button"
                class="min-h-11 rounded-2xl border px-3 text-sm font-bold transition-colors"
                :class="selectedCharge === amount
                  ? 'border-slate bg-slate text-white'
                  : 'border-slate/10 bg-cream/50 text-slate hover:border-slate/25'"
                @click="pickChargeAmount(amount)"
              >
                {{ formatPrice(amount) }}
              </button>
            </div>
            <label class="mt-3 block text-sm font-bold text-slate">
              مبلغ دلخواه
              <input
                v-model="customCharge"
                type="text"
                inputmode="numeric"
                dir="ltr"
                placeholder="مثلاً 75000"
                class="mt-1.5 w-full rounded-2xl border border-slate/10 bg-cream/40 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-lime/60"
                @input="selectedCharge = 0"
              />
            </label>
            <p v-if="chargeError" class="mt-2 text-sm text-red-600">{{ chargeError }}</p>
            <button
              type="button"
              :disabled="charging"
              class="mt-4 min-h-11 w-full rounded-2xl bg-lime py-3 text-sm font-bold text-slate hover:bg-slate hover:text-white disabled:opacity-50 sm:w-auto sm:px-8"
              @click="chargeWallet"
            >
              {{ charging ? 'در حال انتقال به درگاه...' : 'شارژ کیف پول' }}
            </button>
            <p class="mt-3 text-sm leading-relaxed text-slate/50">
              مبلغ را انتخاب کن، بعد از پرداخت در زرین‌پال به همین صفحه برمی‌گردی و موجودی به‌روز می‌شود. بعد از شارژ می‌توانی در مرحله پرداخت سفارش، کیف پول را بزنی.
            </p>
          </section>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { reactive, ref, computed, onMounted, watch } from 'vue'
import { isPlaceholderEmail } from '../utils/digits'
import ProductGrid from '../components/ui/ProductGrid.vue'
import { useWishlistStore } from '../stores/wishlist'
import type { Product } from '~/types/types'

definePageMeta({
  layout: 'default',
  middleware: 'auth',
})

useSeoMeta({
  title: 'پنل کاربری | Booklett',
  description: 'سفارش‌ها، علاقه‌مندی‌ها، نظرات، نشانی و کیف پول.',
})

const auth = useAuthStore()
const toast = useToast()
const wishlist = useWishlistStore()
const savingProfile = ref(false)

type AccountTab = 'orders' | 'wishlist' | 'reviews' | 'address' | 'profile' | 'wallet'

const menu: { id: AccountTab; label: string; icon: string }[] = [
  { id: 'orders', label: 'سفارش‌های من', icon: 'mdi:package-variant-closed' },
  { id: 'wishlist', label: 'کالاهای مورد علاقه', icon: 'mdi:heart-outline' },
  { id: 'reviews', label: 'نظرات', icon: 'mdi:comment-text-outline' },
  { id: 'address', label: 'نشانی‌ها', icon: 'mdi:map-marker-outline' },
  { id: 'profile', label: 'مشخصات فردی', icon: 'mdi:account-outline' },
  { id: 'wallet', label: 'کیف پول', icon: 'mdi:wallet-outline' },
]

const route = useRoute()
const active = ref<AccountTab>(route.query.tab === 'wallet' ? 'wallet' : 'orders')
const charging = ref(false)
const chargeError = ref('')
const selectedCharge = ref(50000)
const customCharge = ref('')
const chargePresets = [50000, 100000, 200000, 500000]

const isAdmin = computed(() => {
  const role = auth.user?.role
  return role === 'admin' || role === 'super-admin'
})

type AccountUser = {
  name: string
  email: string
  phone: string
  address: string
  city: string
  postalCode: string
  walletBalance?: number
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

type AccountReview = {
  id: string
  bookSlug: string
  bookTitle: string
  rating: number
  comment: string
  createdAt: string
}

const profile = reactive<AccountUser>({
  name: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  postalCode: '',
  walletBalance: 0,
})

const { data: me } = await useAsyncData('account-me', () => $fetch<{ ok: boolean; user: AccountUser | null }>('/api/user'))
if (me.value?.user) {
  Object.assign(profile, me.value.user)
}

const walletBalance = computed(() => profile.walletBalance ?? 0)

const { data: orderRes, pending: ordersPending } = await useAsyncData('account-orders', () =>
  $fetch<{ ok: boolean; orders: AccountOrder[] }>('/api/orders/mine'),
)

const orders = computed(() => orderRes.value?.orders ?? [])

const { data: reviewRes, pending: reviewsPending } = await useAsyncData('account-reviews', () =>
  $fetch<{ ok: boolean; reviews: AccountReview[] }>('/api/reviews/mine'),
)

const myReviews = computed(() => reviewRes.value?.reviews ?? [])

const catalog = ref<Product[]>([])
const wishlistPending = ref(false)
const wishlistLoaded = ref(false)

const wishlistProducts = computed(() => {
  const wanted = new Set(wishlist.ids.map(String))
  return catalog.value.filter((book) => wanted.has(String(book.id ?? book._id)))
})

async function loadWishlistBooks() {
  if (wishlistLoaded.value) return
  wishlist.load()
  const ids = wishlist.ids.map(String).filter(Boolean)
  if (!ids.length) {
    catalog.value = []
    wishlistLoaded.value = true
    return
  }
  wishlistPending.value = true
  try {
    catalog.value = await $fetch<Product[]>('/api/books', { query: { ids: ids.join(',') } })
    wishlistLoaded.value = true
  } finally {
    wishlistPending.value = false
  }
}

watch(active, (tab) => {
  if (tab === 'wishlist') void loadWishlistBooks()
}, { immediate: true })

onMounted(async () => {
  wishlist.load()
  if (String(route.query.tab || '') === 'wallet') active.value = 'wallet'
  if (String(route.query.charged || '') === '1') {
    try {
      const res = await $fetch<{ ok: boolean; user: AccountUser | null }>('/api/user')
      if (res?.user) Object.assign(profile, res.user)
    } catch {
      // keep current balance if refresh fails
    }
    toast.success({ message: 'کیف پول شارژ شد', position: 'topRight', timeout: 2200 })
  }
})

function pickChargeAmount(amount: number) {
  selectedCharge.value = amount
  customCharge.value = ''
  chargeError.value = ''
}

function parsedChargeAmount() {
  const custom = Number(String(customCharge.value).replace(/[^\d]/g, ''))
  if (custom > 0) return custom
  return selectedCharge.value
}

async function chargeWallet() {
  const amount = parsedChargeAmount()
  chargeError.value = ''
  if (!amount || amount < 10000) {
    chargeError.value = 'حداقل مبلغ شارژ ۱۰ هزار تومان است.'
    return
  }
  if (amount > 5_000_000) {
    chargeError.value = 'حداکثر مبلغ شارژ ۵ میلیون تومان است.'
    return
  }

  charging.value = true
  try {
    const res = await $fetch<{ ok: boolean; paymentUrl?: string }>('/api/wallet/charge', {
      method: 'POST',
      body: {
        amount,
        callbackUrl: `${window.location.origin}/wallet/callback`,
      },
    })
    if (res?.paymentUrl) {
      window.location.href = res.paymentUrl
      return
    }
    chargeError.value = 'آدرس درگاه دریافت نشد'
  } catch (err: any) {
    chargeError.value = err?.data?.statusMessage || 'اتصال به درگاه برقرار نشد'
  } finally {
    charging.value = false
  }
}

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
