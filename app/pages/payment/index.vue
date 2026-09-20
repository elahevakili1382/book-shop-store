<template>
  <main class="min-h-screen">
    <div class="mx-auto max-w-[560px] px-4 py-10 sm:px-8">
      <ClientOnly>
        <motion.header
          :initial="{ opacity: 0, y: 16 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.45, ease: easeOut }"
          class="relative z-10 mb-6"
        >
          <nav class="mb-4 flex items-center gap-1.5 text-xs text-slate/45">
            <NuxtLink to="/cart" class="transition-colors hover:text-slate">سبد خرید</NuxtLink>
            <AppIcon icon="mdi:chevron-left" class="h-3.5 w-3.5 shrink-0" />
            <NuxtLink to="/address" class="transition-colors hover:text-slate">ارسال</NuxtLink>
            <AppIcon icon="mdi:chevron-left" class="h-3.5 w-3.5 shrink-0" />
            <span class="text-slate/70">پرداخت</span>
          </nav>

          <h1 class="text-2xl font-black tracking-tight text-slate sm:text-3xl">پرداخت</h1>
          <p class="mt-1.5 text-sm text-slate/50">جزئیات سفارش را بررسی کن و نهایی کن</p>
        </motion.header>
      </ClientOnly>

      <CheckoutStepper current="payment" />

      <div class="space-y-4 rounded-[1.35rem] border border-slate/8 bg-white p-5 shadow-card sm:p-6">
        <div class="flex items-center justify-between text-sm">
          <span class="text-slate/60">نام گیرنده</span>
          <span class="font-semibold text-slate">{{ fullName || '—' }}</span>
        </div>
        <div class="flex items-center justify-between text-sm">
          <span class="text-slate/60">موبایل</span>
          <span class="font-semibold text-slate" dir="ltr">{{ phone || '—' }}</span>
        </div>
        <div class="flex items-center justify-between text-sm">
          <span class="text-slate/60">روش دریافت</span>
          <span class="font-semibold text-slate">
            {{ shippingMethod === 'pickup' ? 'تحویل حضوری' : 'ارسال پیک' }}
          </span>
        </div>
        <div v-if="shippingMethod === 'courier'" class="text-sm">
          <p class="text-slate/60">آدرس</p>
          <p class="mt-1 font-semibold leading-relaxed text-slate">{{ city }}، {{ address }}</p>
        </div>
        <div class="flex items-center justify-between text-sm">
          <span class="text-slate/60">روش پرداخت</span>
          <span class="font-semibold text-slate">
            {{ isOnline ? 'پرداخت آنلاین زرین‌پال' : 'پرداخت در محل' }}
          </span>
        </div>

        <div class="h-px bg-slate/8" />

        <div class="flex items-center justify-between">
          <span class="text-sm font-bold text-slate">مبلغ قابل پرداخت</span>
          <span class="text-xl font-black tabular-nums text-slate">
            {{ formatPrice(amount) }}
            <span class="text-xs font-bold text-slate/40">تومان</span>
          </span>
        </div>
      </div>

      <div class="mt-4 space-y-3">
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
      </div>
    </div>
  </main>
</template>

<script setup>
import { onMounted, computed, ref } from 'vue'
import { useCartStore } from '../../stores/cart'
import { motion } from 'motion-v'
import CheckoutStepper from '../../components/ui/CheckoutStepper.vue'

definePageMeta({ layout: 'default' })

useSeoMeta({
  title: 'پرداخت',
  description: 'بررسی سفارش و پرداخت آنلاین یا در محل.',
})

const fullName = ref('')
const phone = ref('')
const city = ref('')
const address = ref('')
const payment = ref('online')
const shippingMethod = ref('courier')
const amount = ref(0)
const orderId = ref('')
const busy = ref(false)

const cart = useCartStore()
const toast = useToast()
const easeOut = [0.22, 1, 0.36, 1]
const isOnline = computed(() => payment.value === 'online')

function formatPrice(value) {
  return new Intl.NumberFormat('fa-IR').format(value || 0)
}

async function confirmOrder() {
  if (!orderId.value) {
    toast.error('سفارش پیدا نشد')
    navigateTo('/cart')
    return
  }

  busy.value = true
  try {
    if (!isOnline.value) {
      await $fetch('/api/payment/cod', {
        method: 'POST',
        body: { orderId: orderId.value },
      })
      cart.clearCart()
      sessionStorage.removeItem('checkout')
      await navigateTo('/payment/callback?cod=ok')
      return
    }

    const res = await $fetch('/api/payment/request', {
      method: 'POST',
      body: {
        orderId: orderId.value,
        callbackUrl: `${window.location.origin}/payment/callback`,
      },
    })

    if (res.amount) amount.value = res.amount
    if (res.paymentUrl) {
      window.location.href = res.paymentUrl
      return
    }
    toast.error('آدرس درگاه دریافت نشد')
  } catch (e) {
    toast.error(e?.data?.statusMessage || e?.statusMessage || 'خطا در اتصال به درگاه')
  } finally {
    busy.value = false
  }
}

onMounted(() => {
  cart.loadCart()
  if (!import.meta.client) return

  try {
    const raw = sessionStorage.getItem('checkout')
    if (!raw) {
      navigateTo('/cart')
      return
    }
    const data = JSON.parse(raw)

    if (!data.orderId) {
      navigateTo('/address')
      return
    }

    orderId.value = data.orderId
    fullName.value = data.fullName || ''
    phone.value = data.phone || ''
    city.value = data.city || ''
    address.value = data.address || ''
    payment.value = data.payment || 'online'
    shippingMethod.value = data.shippingMethod || 'courier'
    amount.value = data.amount || 0
  } catch {
    navigateTo('/cart')
  }
})
</script>
