<template>
  <main class="min-h-screen pb-28 lg:pb-16">
    <div class="mx-auto max-w-[1120px] px-4 py-10 sm:px-8">
      <header class="relative z-10 mb-6">
        <nav class="mb-4 flex items-center gap-1.5 text-xs text-slate/45">
          <NuxtLink to="/cart" class="transition-colors hover:text-slate">سبد خرید</NuxtLink>
          <AppIcon icon="mdi:chevron-left" class="h-3.5 w-3.5 shrink-0" />
          <NuxtLink to="/address" class="transition-colors hover:text-slate">ارسال</NuxtLink>
          <AppIcon icon="mdi:chevron-left" class="h-3.5 w-3.5 shrink-0" />
          <span class="text-slate/70">پرداخت</span>
        </nav>

        <h1 class="text-2xl font-black tracking-tight text-slate sm:text-3xl">بررسی و پرداخت</h1>
        <p class="mt-1.5 text-sm text-slate/50">سفارش را یک‌بار بررسی کن، بعد روش پرداخت را بزن.</p>
      </header>

      <CheckoutStepper current="payment" />

      <div class="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <section class="space-y-4 lg:col-span-7">
          <div class="space-y-4 rounded-[1.35rem] border border-slate/8 bg-white p-5 shadow-card sm:p-6">
            <div class="flex items-center justify-between gap-3">
              <h2 class="text-base font-black text-slate">ارسال</h2>
              <NuxtLink to="/address" class="text-xs font-bold text-slate/45 hover:text-slate">ویرایش</NuxtLink>
            </div>
            <div class="flex items-center justify-between text-sm">
              <span class="text-slate/60">گیرنده</span>
              <span class="font-semibold text-slate">{{ fullName || '—' }}</span>
            </div>
            <div class="flex items-center justify-between text-sm">
              <span class="text-slate/60">موبایل</span>
              <span class="font-semibold text-slate" dir="ltr">{{ phone || '—' }}</span>
            </div>
            <div class="flex items-center justify-between text-sm">
              <span class="text-slate/60">روش دریافت</span>
              <span class="font-semibold text-slate">{{ shippingLabel(shippingMethod) }}</span>
            </div>
            <div v-if="shippingMethod === 'courier'" class="text-sm">
              <p class="text-slate/60">آدرس</p>
              <p class="mt-1 font-semibold leading-relaxed text-slate">{{ city }}، {{ address }}</p>
            </div>
          </div>

          <fieldset class="space-y-3 rounded-[1.35rem] border border-slate/8 bg-white p-5 shadow-card sm:p-6">
            <legend class="text-base font-black text-slate">روش پرداخت</legend>
            <label
              v-for="method in paymentMethods"
              :key="method.value"
              :class="[
                'flex cursor-pointer items-center gap-3 rounded-2xl border p-3 transition-all',
                payment === method.value
                  ? 'border-slate/25 bg-cream shadow-sm'
                  : 'border-slate/8 bg-white hover:border-slate/15',
              ]"
            >
              <input v-model="payment" type="radio" name="payment" :value="method.value" class="sr-only" />
              <span
                :class="[
                  'flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2',
                  payment === method.value ? 'border-slate' : 'border-slate/25',
                ]"
              >
                <span v-if="payment === method.value" class="h-2 w-2 rounded-full bg-slate" />
              </span>
              <span class="min-w-0 flex-1">
                <span class="block text-sm font-semibold text-slate">{{ method.label }}</span>
                <span class="mt-0.5 block text-xs text-slate/45">{{ method.desc }}</span>
              </span>
              <AppIcon :icon="method.icon" class="h-4 w-4 text-slate/35" />
            </label>
          </fieldset>
        </section>

        <aside class="lg:col-span-5">
          <div class="space-y-5 rounded-[1.5rem] border border-slate/8 bg-white p-5 shadow-card sm:p-6 lg:sticky lg:top-24">
            <div class="flex items-center justify-between">
              <h2 class="text-lg font-black text-slate">اقلام سفارش</h2>
              <NuxtLink to="/cart" class="text-xs font-bold text-slate/45 hover:text-slate">ویرایش سبد</NuxtLink>
            </div>

            <ul class="space-y-3">
              <li v-for="item in cart.cartItems" :key="item.uniqueId" class="flex gap-3">
                <NuxtLink :to="itemHref(item)" class="h-14 w-11 shrink-0 overflow-hidden rounded-lg bg-cream">
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
                <p class="shrink-0 text-sm font-bold tabular-nums text-slate">
                  {{ formatPrice(item.price * item.quantity) }}
                </p>
              </li>
            </ul>

            <div class="space-y-3 text-sm">
              <div class="flex items-center justify-between text-slate/60">
                <span>جمع کالاها</span>
                <span class="font-semibold tabular-nums text-slate">{{ formatPrice(cart.cartTotal) }} تومان</span>
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

            <button
              type="button"
              :disabled="busy"
              class="w-full rounded-2xl bg-slate py-3.5 text-sm font-bold text-white hover:bg-lime hover:text-slate disabled:opacity-50"
              @click="confirmOrder"
            >
              {{ isOnline ? 'پرداخت آنلاین' : 'ثبت سفارش و پرداخت در محل' }}
            </button>
            <button
              type="button"
              class="w-full rounded-2xl border border-slate/15 bg-white py-3.5 text-sm font-bold text-slate"
              @click="navigateTo('/address')"
            >
              بازگشت به ارسال
            </button>
            <p class="text-center text-[11px] leading-relaxed text-slate/40">
              کارت بانکی در همین صفحه گرفته نمی‌شود. پرداخت آنلاین به درگاه زرین‌پال می‌رود.
            </p>
          </div>
        </aside>
      </div>
    </div>
  </main>
</template>

<script setup>
import { onMounted, computed, ref, watch } from 'vue'
import { useCartStore } from '../../stores/cart'
import CheckoutStepper from '../../components/ui/CheckoutStepper.vue'
import { loadCheckout, saveCheckout, shippingFee, shippingLabel } from '../../utils/checkout'
import { productPath } from '../../utils/slugify'

definePageMeta({ layout: 'default' })

useSeoMeta({
  title: 'پرداخت',
  description: 'بررسی سفارش و پرداخت آنلاین یا در محل.',
})

const fullName = ref('')
const phone = ref('')
const city = ref('')
const postalCode = ref('')
const address = ref('')
const payment = ref('online')
const shippingMethod = ref('courier')
const selectedDay = ref('')
const selectedSlot = ref('')
const orderId = ref('')
const busy = ref(false)

const cart = useCartStore()
const toast = useToast()
const isOnline = computed(() => payment.value === 'online')
const shippingCost = computed(() => shippingFee(shippingMethod.value))
const payableTotal = computed(() => cart.cartTotal + shippingCost.value)

const paymentMethods = [
  {
    value: 'online',
    label: 'پرداخت آنلاین زرین‌پال',
    desc: 'انتقال به درگاه امن؛ سفارش بعد از تأیید پرداخت قطعی می‌شود',
    icon: 'mdi:credit-card-outline',
  },
  {
    value: 'delivery',
    label: 'پرداخت در محل',
    desc: 'مبلغ را هنگام تحویل نقدی یا کارت می‌پردازی',
    icon: 'mdi:cash-multiple',
  },
]

function itemHref(item) {
  return productPath({ slug: item.slug, title: item.name, id: item.id })
}

function formatPrice(value) {
  return new Intl.NumberFormat('fa-IR').format(value || 0)
}

watch(payment, (value) => {
  if (orderId.value) {
    orderId.value = ''
    saveCheckout({ payment: value }, { dropOrder: true })
    return
  }
  saveCheckout({ payment: value })
})

async function ensureOrder() {
  if (orderId.value) return orderId.value

  const res = await $fetch('/api/orders', {
    method: 'POST',
    body: {
      customerName: fullName.value.trim(),
      phone: phone.value.trim(),
      address: address.value.trim(),
      city: city.value.trim(),
      postalCode: postalCode.value.trim(),
      paymentMethod: payment.value === 'online' ? 'online' : 'cod',
      shippingMethod: shippingMethod.value,
      deliveryDay: selectedDay.value,
      deliverySlot: selectedSlot.value,
      items: cart.cartItems.map((item) => ({
        bookId: String(item.id),
        slug: item.slug || '',
        quantity: item.quantity,
      })),
    },
  })

  if (!res?.ok || !res.order?.id) {
    throw new Error('ثبت سفارش ناموفق بود')
  }

  orderId.value = res.order.id
  saveCheckout({
    orderId: res.order.id,
    amount: res.order.amount,
    payment: payment.value,
  })
  return res.order.id
}

async function confirmOrder() {
  if (!fullName.value.trim() || !phone.value.trim() || !cart.cartItems.length) {
    toast.error('اطلاعات ارسال ناقص است')
    navigateTo('/address')
    return
  }

  busy.value = true
  try {
    const id = await ensureOrder()

    if (!isOnline.value) {
      await $fetch('/api/payment/cod', {
        method: 'POST',
        body: { orderId: id },
      })
      cart.clearCart()
      saveCheckout({ orderId: id })
      await navigateTo(`/payment/callback?cod=ok&order=${encodeURIComponent(id)}`)
      return
    }

    const res = await $fetch('/api/payment/request', {
      method: 'POST',
      body: {
        orderId: id,
        callbackUrl: `${window.location.origin}/payment/callback`,
      },
    })

    if (res.paymentUrl) {
      window.location.href = res.paymentUrl
      return
    }
    toast.error('آدرس درگاه دریافت نشد')
  } catch (e) {
    toast.error(
      e?.data?.message || e?.data?.statusMessage || e?.statusMessage || e?.message || 'خطا در ثبت سفارش',
    )
  } finally {
    busy.value = false
  }
}

onMounted(() => {
  cart.loadCart()
  if (!import.meta.client) return

  if (!cart.cartItems.length) {
    navigateTo('/cart')
    return
  }

  const data = loadCheckout()
  if (!data.fullName || !data.phone) {
    navigateTo('/address')
    return
  }

  fullName.value = data.fullName || ''
  phone.value = data.phone || ''
  city.value = data.city || ''
  postalCode.value = data.postalCode || ''
  address.value = data.address || ''
  payment.value = data.payment === 'delivery' ? 'delivery' : 'online'
  shippingMethod.value = data.shippingMethod || 'courier'
  selectedDay.value = data.selectedDay || ''
  selectedSlot.value = data.selectedSlot || ''
  orderId.value = data.orderId || ''
})
</script>
