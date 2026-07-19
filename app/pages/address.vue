<template>
  <main class="bg-cream min-h-screen">
    <div class="max-w-[1120px] mx-auto px-4 sm:px-8 py-10">
      <ClientOnly>
        <motion.header :initial="{ opacity: 0, y: 16 }" :animate="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.45, ease: easeOut }" class="relative z-10 mb-8">
          <nav class="flex items-center gap-1.5 text-xs text-slate/45 mb-4">
            <NuxtLink to="/cart" class="hover:text-slate transition-colors">سبد خرید</NuxtLink>
            <AppIcon icon="mdi:chevron-left" class="w-3.5 h-3.5 shrink-0" />
            <span class="text-slate/70">ارسال</span>
          </nav>

          <h1 class="text-2xl sm:text-3xl font-black text-slate tracking-tight">اطلاعات ارسال</h1>
          <p class="mt-1.5 text-sm text-slate/50">آدرس، روش دریافت و زمان ارسال را مشخص کنید</p>
        </motion.header>
      </ClientOnly>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <section class="lg:col-span-7 space-y-5">
          <!-- روش دریافت -->
          <div class="rounded-[1.35rem] border border-slate/8 shadow-card p-5 sm:p-6 space-y-4">
            <h2 class="text-base font-black text-slate">روش دریافت کالا را انتخاب کنید</h2>


            <div class="grid gap-3">
              <button v-for="method in shippingMethods" :key="method.value" type="button" :class="[
                'text-right p-4 rounded-2xl border transition-all',
                shippingMethod === method.value
                  ? 'border-slate/30 bg-cream shadow-sm'
                  : 'border-slate/8 hover:border-slate/15',
              ]" @click="shippingMethod = method.value">
                <p class="font-bold text-slate text-sm">{{ method.label }}</p>
                <p class="mt-1 text-xs text-slate/45">{{ method.desc }}</p>
              </button>
            </div>
          </div>

          <!-- فرم گیرنده -->
          <div class="rounded-[1.35rem] bg-white border border-slate/8 shadow-card p-5 sm:p-6 space-y-3">
            <label for="fullName">نام و نام خانوادگی</label>
            <input id="fullName" v-model="fullName" type="text"
              class="w-full rounded-2xl border border-slate/10 bg-white px-4 py-3 text-sm" />

            <label for="phone">موبایل</label>
            <input id="phone" v-model="phone" type="text"
              class="w-full rounded-2xl border border-slate/10 bg-white px-4 py-3 text-sm" />

            <!-- فقط وقتی ارسال به آدرس انتخاب شده -->
            <template v-if="shippingMethod === 'courier'">
              <label for="city">شهر</label>
              <input id="city" v-model="city" type="text"
                class="w-full rounded-2xl border border-slate/10 bg-white px-4 py-3 text-sm" />

              <label for="postalCode">کد پستی</label>
              <input id="postalCode" v-model="postalCode" type="text"
                class="w-full rounded-2xl border border-slate/10 bg-white px-4 py-3 text-sm" />

              <label for="address">آدرس کامل</label>
              <textarea id="address" v-model="address" rows="3"
                class="w-full rounded-2xl border border-slate/10 bg-white px-4 py-3 text-sm" />
            </template>
          </div>

          <!-- زمان ارسال -->
          <div v-if="shippingMethod === 'courier'"
            class="rounded-[1.35rem] bg-white border border-slate/8 shadow-card p-5 sm:p-6 space-y-4">
            <div class="flex items-center justify-between gap-3">
              <h2 class="text-base font-black text-slate">زمان ارسال را انتخاب کنید</h2>
              <span :class="[
                'px-2.5 py-1 rounded-full text-[11px] font-bold shrink-0',
                selectedDay && selectedSlot
                  ? 'bg-lime/40 text-slate'
                  : 'bg-red-50 text-red-500',
              ]">
                {{ selectedDay && selectedSlot ? 'تعیین شد' : 'تعیین نشد' }}
              </span>
            </div>

            <div class="space-y-2">
              <p class="text-xs font-semibold text-slate/45">روز تحویل</p>
              <div class="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
                <button v-for="day in shippingDays" :key="day.key" type="button"
                  class="shrink-0 min-w-[92px] px-3 py-3 rounded-2xl border text-center transition-all" :class="selectedDay === day.key
                    ? 'bg-slate text-white border-slate shadow-sm'
                    : 'bg-cream/60 border-slate/10 text-slate hover:border-slate/20'
                    " @click="selectedDay = day.key">
                  <span class="block text-xs font-bold leading-tight">{{ day.weekday }}</span>
                  <span class="block mt-1 text-[11px] leading-tight"
                    :class="selectedDay === day.key ? 'text-white/70' : 'text-slate/45'">
                    {{ day.label }}
                  </span>
                </button>
              </div>
            </div>

            <div class="space-y-2">
              <p class="text-xs font-semibold text-slate/45">بازه زمانی</p>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button v-for="slot in timeSlots" :key="slot.value" type="button"
                  class="w-full px-4 py-3 rounded-2xl border text-sm font-bold text-center transition-all" :class="selectedSlot === slot.value
                    ? 'bg-slate text-white border-slate shadow-sm'
                    : 'bg-cream/60 border-slate/10 text-slate hover:border-slate/20'
                    " @click="selectedSlot = slot.value">
                  {{ slot.label }}
                </button>
              </div>
            </div>
          </div>


          <div class="p-4 rounded-2xl bg-white border border-slate/10">
            <p class="text-xs text-slate/45 mb-1">روش پرداخت</p>
            <p class="text-sm font-bold text-slate">
              {{ payment === 'online' ? 'پرداخت آنلاین' : 'پرداخت در محل' }}
            </p>
          </div>

          <button type="button" class="w-full py-3.5 rounded-2xl bg-slate text-white font-bold text-sm"
            @click="submitAddress">
            ثبت و ادامه پرداخت
          </button>
        </section>

        <aside class="lg:col-span-5">
          <div
            class="rounded-[1.5rem] bg-white border border-slate/8 shadow-card p-5 sm:p-6 space-y-5 lg:sticky lg:top-24">
            <div class="flex items-center justify-between">
              <h2 class="text-lg font-black text-slate">خلاصه سفارش</h2>
              <span class="px-2.5 py-1 rounded-full bg-lime/40 text-slate text-[11px] font-bold">
                {{ cart.cartCount.toLocaleString('fa-IR') }} قلم
              </span>
            </div>

            <div class="space-y-3 text-sm">
              <div class="flex items-center justify-between text-slate/60">
                <span>جمع جزء</span>
                <span class="font-semibold text-slate tabular-nums">
                  {{ formatPrice(cart.cartTotal) }} تومان
                </span>
              </div>
              <div class="flex items-center justify-between text-slate/60">
                <span>هزینه ارسال</span>
                <span class="font-semibold text-emerald-600">
                  {{ shippingCost === 0 ? 'رایگان' : formatPrice(shippingCost) + 'تومان' }}
                </span>
              </div>
              <div class="h-px bg-slate/8" />
              <div class="flex items-center justify-between">
                <span class="font-bold text-slate">مبلغ قابل پرداخت</span>
                <span class="text-xl font-black text-slate tabular-nums">
                  {{ formatPrice(payableTotal) }}
                  <span class="text-xs font-bold text-slate/40">تومان</span>
                </span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { motion } from 'motion-v'
import { useCartStore } from '../stores/cart'

definePageMeta({ layout: 'default' })

useSeoMeta({
  title: 'اطلاعات ارسال',
  description: 'انتخاب روش ارسال، آدرس گیرنده و زمان تحویل سفارش',
})

const cart = useCartStore()
const easeOut = [0.22, 1, 0.36, 1]

const fullName = ref('')
const phone = ref('')
const city = ref('')
const postalCode = ref('')
const address = ref('')
const payment = ref('online')
const shippingMethod = ref('courier')
const selectedDay = ref('')
const selectedSlot = ref('')

const timeSlots = [
  { value: '09-15', label: '9 صبح تا 3 بعد از ظهر' },
  { value: '15-21', label: '3 بعد از ظهر تا 9 شب' },
]

const shippingDays = computed(() => {
  const days = []
  const base = new Date() //امروز 
  const weekdayNames = ['یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه', 'شنبه']
  for (let i = 1; i <= 4; i++) {
    const d = new Date(base)
    d.setDate(base.getDate() + i) //روز بعد 
    const weekday = weekdayNames[d.getDay()]
    const key = d.toISOString().slice(0, 10) // '2026-07-14'
    const label = d.toLocaleDateString('fa-IR', {
      day: 'numeric',
      month: 'short',
    })
    days.push({ key, label, weekday })
  }
  return days
})

const shippingMethods = [
  {
    value: 'courier',
    label: 'ارسال به آدرس انتخاب‌شده',
    desc: 'تحویل درب منزل توسط پیک، ۳ تا ۵ روز کاری',
    cost: 45000,
  },
  {
    value: 'pickup',
    label: 'تحویل حضوری از فروشگاه',
    desc: 'مراجعه حضوری پس از آماده‌سازی سفارش — بدون هزینه ارسال',
    cost: 0
  },
]

const shippingCost = computed(() => {
  const method = shippingMethods.find((m) => m.value === shippingMethod.value)
  return method ? method.cost : 0
})

const payableTotal = computed(() => {

  return cart.cartTotal + shippingCost.value

})


onMounted(() => {
  const firstDay = shippingDays.value[0]
  if (firstDay) {
    selectedDay.value = firstDay.key
  }
  cart.loadCart()
  if (!import.meta.client) return

  try {
    const raw = sessionStorage.getItem('checkout')
    if (!raw) return
    const data = JSON.parse(raw)

    if (data.address) address.value = data.address
    if (data.payment) payment.value = data.payment
    if (data.fullName) fullName.value = data.fullName
    if (data.phone) phone.value = data.phone
    if (data.city) city.value = data.city
    if (data.postalCode) postalCode.value = data.postalCode
    if (data.shippingMethod) shippingMethod.value = data.shippingMethod
    if (data.selectedDay) selectedDay.value = data.selectedDay
    if (data.selectedSlot) selectedSlot.value = data.selectedSlot
  } catch {
  }
})

function formatPrice(value) {
  return new Intl.NumberFormat('fa-IR').format(value)
}

function submitAddress() {
  if (!fullName.value || !phone.value) {
    alert('نام و موبایل الزامی است')
    return
  }
  if (!cart.cartItems.length) {
    alert('سبد خرید خالی است')
    navigateTo('/cart')
    return
  }
  if (shippingMethod.value === 'courier') {
    if (!selectedDay.value || !selectedSlot.value) {
      alert('روز و بازه زمانی را انتخاب کنید')
      return
    }
    if (!address.value || !city.value) {
      alert('شهر و آدرس را کامل کنید')
      return
    }
  }

  sessionStorage.setItem(
    'checkout',
    JSON.stringify({
      address: address.value.trim(),
      payment: payment.value,
      fullName: fullName.value,
      phone: phone.value,
      city: city.value,
      postalCode: postalCode.value,
      shippingMethod: shippingMethod.value,
      selectedDay: selectedDay.value,
      selectedSlot: selectedSlot.value,
      shippingCost: shippingCost.value,
      amount: payableTotal.value,
      items: cart.cartItems.map((item) => ({
        title: item.name,
        price: item.price,
        quantity: item.quantity,
        bookId: String(item.id)
      }))
    }),
  )

  navigateTo('/payment')
}
</script>
