<template>
  <main class="min-h-screen pb-28 lg:pb-16">
    <div class="mx-auto max-w-[1120px] px-4 py-10 sm:px-8">
      <header class="relative z-10 mb-8">
        <nav class="mb-4 flex items-center gap-1.5 text-xs text-slate/45">
          <NuxtLink to="/cart" class="transition-colors hover:text-slate">سبد خرید</NuxtLink>
          <AppIcon icon="mdi:chevron-left" class="h-3.5 w-3.5 shrink-0" />
          <span class="text-slate/70">ارسال</span>
        </nav>

        <h1 class="text-2xl font-black tracking-tight text-slate sm:text-3xl">اطلاعات ارسال</h1>
        <p class="mt-1.5 text-sm text-slate/50">روش دریافت و آدرس را مشخص کن. سفارش هنوز ثبت نمی‌شود.</p>
      </header>

      <CheckoutStepper current="address" />

      <div
        v-if="!auth.isAuthenticated"
        class="mb-6 flex flex-col gap-3 rounded-[1.35rem] border border-slate/10 bg-white p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5"
      >
        <div>
          <p class="text-sm font-bold text-slate">ورود اختیاری است</p>
          <p class="mt-1 text-xs leading-relaxed text-slate/50">
            با حساب، آدرس پر می‌شود و سفارش در پنل می‌ماند. مهمان هم می‌توانی ادامه بدهی.
          </p>
        </div>
        <NuxtLink
          to="/login?redirect=/address"
          class="shrink-0 rounded-2xl bg-slate px-4 py-2.5 text-center text-sm font-bold text-white hover:bg-lime hover:text-slate"
        >
          ورود یا ثبت‌نام
        </NuxtLink>
      </div>

      <form class="grid grid-cols-1 gap-8 lg:grid-cols-12" @submit.prevent="submitAddress">
        <section class="space-y-5 lg:col-span-7">
          <fieldset class="space-y-4 rounded-[1.35rem] border border-slate/8 bg-white p-5 shadow-card sm:p-6">
            <legend class="text-base font-black text-slate">روش دریافت</legend>

            <div class="grid gap-3">
              <label
                v-for="method in shippingMethods"
                :key="method.value"
                :class="[
                  'cursor-pointer rounded-2xl border p-4 text-right transition-all',
                  shippingMethod === method.value
                    ? 'border-slate/30 bg-cream shadow-sm'
                    : 'border-slate/8 hover:border-slate/15',
                ]"
              >
                <input
                  v-model="shippingMethod"
                  type="radio"
                  name="shippingMethod"
                  :value="method.value"
                  class="sr-only"
                />
                <div class="flex items-start justify-between gap-3">
                  <div>
                    <p class="text-sm font-bold text-slate">{{ method.label }}</p>
                    <p class="mt-1 text-xs text-slate/45">{{ method.desc }}</p>
                  </div>
                  <p class="shrink-0 text-sm font-black tabular-nums text-slate">
                    {{ method.cost === 0 ? 'رایگان' : formatPrice(method.cost) + ' تومان' }}
                  </p>
                </div>
              </label>
            </div>
          </fieldset>

          <div class="space-y-3 rounded-[1.35rem] border border-slate/8 bg-white p-5 shadow-card sm:p-6">
            <h2 class="text-base font-black text-slate">گیرنده</h2>

            <label for="fullName" class="block text-sm font-bold text-slate">نام و نام خانوادگی</label>
            <input
              id="fullName"
              v-model="fullName"
              type="text"
              name="name"
              autocomplete="name"
              required
              enterkeyhint="next"
              class="w-full rounded-2xl border border-slate/10 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-lime/50"
            />

            <label for="phone" class="block text-sm font-bold text-slate">موبایل</label>
            <input
              id="phone"
              v-model="phone"
              type="tel"
              name="tel"
              inputmode="numeric"
              autocomplete="tel"
              enterkeyhint="next"
              dir="ltr"
              required
              class="w-full rounded-2xl border border-slate/10 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-lime/50"
              placeholder="09121234567"
            />

            <template v-if="shippingMethod === 'courier'">
              <label for="city" class="block text-sm font-bold text-slate">شهر</label>
              <input
                id="city"
                v-model="city"
                type="text"
                name="city"
                autocomplete="address-level2"
                required
                enterkeyhint="next"
                class="w-full rounded-2xl border border-slate/10 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-lime/50"
              />

              <label for="postalCode" class="block text-sm font-bold text-slate">کد پستی</label>
              <input
                id="postalCode"
                v-model="postalCode"
                type="text"
                name="postal-code"
                autocomplete="postal-code"
                inputmode="numeric"
                dir="ltr"
                enterkeyhint="next"
                class="w-full rounded-2xl border border-slate/10 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-lime/50"
              />

              <label for="address" class="block text-sm font-bold text-slate">آدرس کامل</label>
              <textarea
                id="address"
                v-model="address"
                name="address"
                autocomplete="street-address"
                required
                rows="3"
                enterkeyhint="done"
                class="w-full rounded-2xl border border-slate/10 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-lime/50"
              />
            </template>

            <p v-else class="rounded-2xl bg-cream px-4 py-3 text-xs leading-relaxed text-slate/55">
              پس از آماده‌سازی سفارش پیام می‌دهیم. تحویل حضوری هزینه ارسال ندارد.
            </p>
          </div>

          <div
            v-if="shippingMethod === 'courier'"
            class="space-y-4 rounded-[1.35rem] border border-slate/8 bg-white p-5 shadow-card sm:p-6"
          >
            <div class="flex items-center justify-between gap-3">
              <h2 class="text-base font-black text-slate">زمان ارسال</h2>
              <span
                :class="[
                  'shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold',
                  selectedDay && selectedSlot ? 'bg-lime/40 text-slate' : 'bg-red-50 text-red-500',
                ]"
              >
                {{ selectedDay && selectedSlot ? 'تعیین شد' : 'تعیین نشد' }}
              </span>
            </div>

            <div class="space-y-2">
              <p class="text-xs font-semibold text-slate/45">روز تحویل</p>
              <div class="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
                <button
                  v-for="day in shippingDays"
                  :key="day.key"
                  type="button"
                  class="min-w-[92px] shrink-0 rounded-2xl border px-3 py-3 text-center transition-all"
                  :class="
                    selectedDay === day.key
                      ? 'border-slate bg-slate text-white shadow-sm'
                      : 'border-slate/10 bg-cream/60 text-slate hover:border-slate/20'
                  "
                  @click="selectedDay = day.key"
                >
                  <span class="block text-xs font-bold leading-tight">{{ day.weekday }}</span>
                  <span
                    class="mt-1 block text-[11px] leading-tight"
                    :class="selectedDay === day.key ? 'text-white/70' : 'text-slate/45'"
                  >
                    {{ day.label }}
                  </span>
                </button>
              </div>
            </div>

            <div class="space-y-2">
              <p class="text-xs font-semibold text-slate/45">بازه زمانی</p>
              <div class="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <button
                  v-for="slot in timeSlots"
                  :key="slot.value"
                  type="button"
                  class="w-full rounded-2xl border px-4 py-3 text-center text-sm font-bold transition-all"
                  :class="
                    selectedSlot === slot.value
                      ? 'border-slate bg-slate text-white shadow-sm'
                      : 'border-slate/10 bg-cream/60 text-slate hover:border-slate/20'
                  "
                  @click="selectedSlot = slot.value"
                >
                  {{ slot.label }}
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            class="w-full rounded-2xl bg-slate py-3.5 text-sm font-bold text-white hover:bg-lime hover:text-slate"
          >
            ادامه به پرداخت
          </button>
        </section>

        <aside class="lg:col-span-5">
          <div class="space-y-5 rounded-[1.5rem] border border-slate/8 bg-white p-5 shadow-card sm:p-6 lg:sticky lg:top-24">
            <div class="flex items-center justify-between">
              <h2 class="text-lg font-black text-slate">خلاصه سفارش</h2>
              <span class="rounded-full bg-lime/40 px-2.5 py-1 text-[11px] font-bold text-slate">
                {{ cart.cartCount.toLocaleString('fa-IR') }} قلم
              </span>
            </div>

            <ul class="space-y-3">
              <li v-for="item in cart.cartItems" :key="item.uniqueId" class="flex gap-3">
                <NuxtLink
                  :to="itemHref(item)"
                  class="h-14 w-11 shrink-0 overflow-hidden rounded-lg bg-cream"
                >
                  <img v-if="item.image" :src="item.image" :alt="item.name" class="h-full w-full object-cover" />
                </NuxtLink>
                <div class="min-w-0 flex-1">
                  <NuxtLink :to="itemHref(item)" class="line-clamp-2 text-sm font-bold text-slate hover:underline">
                    {{ item.name }}
                  </NuxtLink>
                  <p class="mt-0.5 text-xs text-slate/45">
                    {{ item.quantity.toLocaleString('fa-IR') }} × {{ formatPrice(item.price) }}
                  </p>
                </div>
              </li>
            </ul>

            <div class="space-y-3 text-sm">
              <div class="flex items-center justify-between text-slate/60">
                <span>جمع کالاها</span>
                <span class="font-semibold tabular-nums text-slate">
                  {{ formatPrice(cart.cartTotal) }} تومان
                </span>
              </div>
              <div class="flex items-center justify-between text-slate/60">
                <span>هزینه ارسال</span>
                <span class="font-semibold text-slate">
                  {{ shippingCost === 0 ? 'رایگان' : formatPrice(shippingCost) + ' تومان' }}
                </span>
              </div>
              <div class="h-px bg-slate/8" />
              <div class="flex items-center justify-between">
                <span class="font-bold text-slate">مبلغ قابل پرداخت</span>
                <span class="text-xl font-black tabular-nums text-slate">
                  {{ formatPrice(payableTotal) }}
                  <span class="text-xs font-bold text-slate/40">تومان</span>
                </span>
              </div>
            </div>
          </div>
        </aside>
      </form>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useCartStore } from '../stores/cart'
import CheckoutStepper from '../components/ui/CheckoutStepper.vue'
import { loadCheckout, saveCheckout, SHIPPING_COST } from '../utils/checkout'
import { productPath } from '../utils/slugify'
import { isIranMobile, toEnglishDigits } from '../utils/digits'

definePageMeta({ layout: 'default' })

useSeoMeta({
  title: 'اطلاعات ارسال',
  description: 'انتخاب روش ارسال، آدرس گیرنده و زمان تحویل سفارش',
})

const cart = useCartStore()
const auth = useAuthStore()
const toast = useToast()

const fullName = ref('')
const phone = ref('')
const city = ref('')
const postalCode = ref('')
const address = ref('')
const shippingMethod = ref('courier')
const selectedDay = ref('')
const selectedSlot = ref('09-15')

const timeSlots = [
  { value: '09-15', label: '۹ صبح تا ۳ بعد از ظهر' },
  { value: '15-21', label: '۳ بعد از ظهر تا ۹ شب' },
]

const shippingDays = computed(() => {
  const days = []
  const base = new Date()
  const weekdayNames = ['یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه', 'شنبه']
  for (let i = 1; i <= 4; i++) {
    const d = new Date(base)
    d.setDate(base.getDate() + i)
    days.push({
      key: d.toISOString().slice(0, 10),
      weekday: weekdayNames[d.getDay()],
      label: d.toLocaleDateString('fa-IR', { day: 'numeric', month: 'short' }),
    })
  }
  return days
})

const shippingMethods = [
  {
    value: 'courier',
    label: 'ارسال به آدرس',
    desc: 'تحویل درب منزل، ۳ تا ۵ روز کاری',
    cost: SHIPPING_COST.courier,
  },
  {
    value: 'pickup',
    label: 'تحویل حضوری از فروشگاه',
    desc: 'پس از آماده‌سازی مراجعه می‌کنی — بدون هزینه ارسال',
    cost: SHIPPING_COST.pickup,
  },
]

const shippingCost = computed(() =>
  shippingMethod.value === 'pickup' ? SHIPPING_COST.pickup : SHIPPING_COST.courier,
)

const payableTotal = computed(() => cart.cartTotal + shippingCost.value)

function itemHref(item) {
  return productPath({ slug: item.slug, title: item.name, id: item.id })
}

function formatPrice(value) {
  return new Intl.NumberFormat('fa-IR').format(value)
}

onMounted(async () => {
  const firstDay = shippingDays.value[0]
  if (firstDay && !selectedDay.value) selectedDay.value = firstDay.key
  if (!selectedSlot.value) selectedSlot.value = timeSlots[0].value
  cart.loadCart()
  if (!import.meta.client) return

  if (!cart.cartItems.length) {
    navigateTo('/cart')
    return
  }

  const data = loadCheckout()
  if (data.address) address.value = data.address
  if (data.fullName) fullName.value = data.fullName
  if (data.phone) phone.value = data.phone
  if (data.city) city.value = data.city
  if (data.postalCode) postalCode.value = data.postalCode
  if (data.shippingMethod) shippingMethod.value = data.shippingMethod
  if (data.selectedDay) selectedDay.value = data.selectedDay
  if (data.selectedSlot) selectedSlot.value = data.selectedSlot

  try {
    const me = await $fetch('/api/user')
    if (me?.ok && me.user) {
      if (!fullName.value) fullName.value = me.user.name || ''
      if (!phone.value) phone.value = me.user.phone || ''
      if (!city.value) city.value = me.user.city || ''
      if (!postalCode.value) postalCode.value = me.user.postalCode || ''
      if (!address.value) address.value = me.user.address || ''
    }
  } catch {
    /* مهمان */
  }
})

function submitAddress() {
  cart.loadCart()
  const mobile = toEnglishDigits(phone.value)
  if (!fullName.value.trim() || !mobile) {
    toast.error('نام و موبایل الزامی است')
    return
  }
  if (!isIranMobile(mobile)) {
    toast.error('موبایل را با ۰۹ و ۱۱ رقم وارد کن')
    return
  }
  if (!cart.cartItems.length) {
    toast.error('سبد خرید خالی است')
    navigateTo('/cart')
    return
  }
  if (shippingMethod.value === 'courier') {
    if (!selectedDay.value || !selectedSlot.value) {
      toast.error('روز و بازه زمانی را انتخاب کنید')
      return
    }
    if (!address.value.trim() || !city.value.trim()) {
      toast.error('شهر و آدرس را کامل کنید')
      return
    }
  }

  phone.value = mobile
  saveCheckout(
    {
      fullName: fullName.value.trim(),
      phone: mobile,
      city: city.value.trim(),
      postalCode: toEnglishDigits(postalCode.value),
      address: address.value.trim(),
      shippingMethod: shippingMethod.value,
      selectedDay: shippingMethod.value === 'courier' ? selectedDay.value : '',
      selectedSlot: shippingMethod.value === 'courier' ? selectedSlot.value : '',
    },
    { dropOrder: true },
  )

  return navigateTo('/payment')
}
</script>
