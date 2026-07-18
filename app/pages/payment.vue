<template>
  <main class="bg-cream min-h-screen">

    <div class="max-w-[560px] mx-auto px-4 sm:px-8 py-10">
      <ClientOnly>
        <motion.header :initial="{ opacity: 0, y: 16 }" :animate="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.45, ease: easeOut }" class="relative z-10 mb-8">
          <!-- breadcrumb -->
          <nav class="flex items-center gap-1.5 text-xs text-slate/45 mb-4">
            <NuxtLink to="/cart" class="hover:text-slate transition-colors">سبد خرید</NuxtLink>
            <AppIcon icon="mdi:chevron-left" class="w-3.5 h-3.5 shrink-0" />
            <NuxtLink to="/address" class="hover:text-slate transition-colors"> ارسال </NuxtLink>
            <AppIcon icon="mdi:chevron-left" class="w-3.5 h-3.5 shrink-0" />
            <span class="text-slate/70">پرداخت</span>
          </nav>

          <h1 class="text-2xl sm:text-3xl font-black text-slate tracking-tight">پرداخت </h1>
          <p class="mt-1.5 text-sm text-slate/50">جزئیات سفارش را بررسی کنید و پرداخت را نهایی کنید </p>
        </motion.header>
      </ClientOnly>


      <div class="rounded-[1.35rem] bg-white border border-slate/8 shadow-card p-5 sm:p-6 space-y-4">
        <div class="flex items-center justify-between text-sm">
          <span class="text-slate/60">نام گیرنده</span>
          <span class="font-semibold text-slate">{{ fullName }}</span>
        </div>

        <div class="flex items-center justify-between text-sm">
          <span class="text-slate/60">روش پرداخت</span>
          <span class="font-semibold text-slate">
            {{ payment === 'online' ? 'پرداخت آنلاین' : 'پرداخت در محل' }}
          </span>
        </div>

        <div class="h-px bg-slate/8" />

        <div class="flex items-center justify-between">
          <span class="font-bold text-slate text-sm">مبلغ قابل پرداخت</span>
          <span class="text-xl font-black text-slate tabular-nums">
            {{ formatPrice(amount) }}
            <span class="text-xs font-bold text-slate/40">تومان</span>
          </span>
        </div>
      </div>

      <div class="space-y-3 mt-4">
        <button type="button" class="w-full py-3.5 rounded-2xl bg-slate text-white font-bold text-sm"
          @click="startPayment">
          پرداخت آنلاین
        </button>
        <button type="button"
          class="w-full py-3.5 rounded-2xl bg-white border border-slate/15 text-slate font-bold text-sm"
          @click="navigateTo('/cart')">
          انصراف
        </button>
        <p :class="[
          'text-center text-xs font-bold px-2.5 py-1.5 rounded-full',
          isPaid ? 'bg-lime/40 text-slate' : 'bg-slate/5 text-slate/50',
        ]">
          {{ isPaid ? 'پرداخت با موفقیت انجام شد' : 'در انتظار پرداخت' }}
        </p>
      </div>


    </div>
  </main>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useCartStore } from '../stores/cart'
import { motion } from 'motion-v'

const fullName = ref('')
const payment = ref('online')
const isPaid = ref(false)
const amount = ref(0)

const cart = useCartStore()
const easeOut = [0.22, 1, 0.36, 1]

function formatPrice(value) {
  return new Intl.NumberFormat('fa-IR').format(value || 0)
}

async function startPayment() {
  try {
    const res = await $fetch('/api/payment/request', {
      method: 'POST',
      body: {
        amount: amount.value,
        callbackUrl: `${window.location.origin}/payment/callback`,
      },
    })

    if (res.paymentUrl) {
      window.location.href = res.paymentUrl
    }
  } catch (e) {
    alert('خطا در اتصال به درگاه')
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

    if (data.fullName) {
      fullName.value = data.fullName
    }
    if (data.payment) {
      payment.value = data.payment
    }
    if (data.amount) {
      amount.value = data.amount
    }
  } catch {
    navigateTo('/cart')
  }
})
</script>
