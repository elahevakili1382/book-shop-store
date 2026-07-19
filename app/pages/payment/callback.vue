<template>
  <main class="bg-cream min-h-screen">
    <div class="max-w-[560px] mx-auto px-4 py-16 text-center">
      <h1 class="text-2xl font-black text-slate mb-3">
        {{ isSuccess ? 'پرداخت با موفقیت انجام شد' : 'پرداخت انجام نشد' }}
      </h1>

      <p class="text-sm text-slate/55 mb-8 leading-relaxed">
        {{ message }}
      </p>

      <div class="flex flex-col sm:flex-row items-center justify-center gap-3">
        <NuxtLink v-if="isSuccess" to="/" class="px-6 py-3 rounded-2xl bg-slate text-white font-bold text-sm">
          بازگشت به فروشگاه
        </NuxtLink>

        <template v-else>
          <NuxtLink to="/cart" class="px-6 py-3 rounded-2xl bg-slate text-white font-bold text-sm">
            بازگشت به سبد خرید
          </NuxtLink>
          <NuxtLink to="/" class="px-6 py-3 rounded-2xl bg-white border border-slate/15 text-slate font-bold text-sm">
            صفحه اصلی
          </NuxtLink>
        </template>
      </div>
    </div>
  </main>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useCartStore } from '../../stores/cart'

const route = useRoute()
const cart = useCartStore()

const message = ref('')
const isSuccess = ref(false)



onMounted(async () => {
  if (!import.meta.client) return

  const status = route.query.Status
  if (status !== 'OK') {
    isSuccess.value = false
    message.value = 'تراکنش تکمیل نشد...'
    return
  }

  const raw = sessionStorage.getItem('checkout')
  const data = JSON.parse(raw)

  await $fetch('/api/orders', {
    method: 'POST', body: {
      customerName: data.fullName,
      phone: data.phone,
      address: data.address,
      city: data.city,
      postalCode: data.postalCode,
      amount: data.amount,
      paymentMethod: 'online',
      status: 'paid',
      items: data.items,
    }
  })

  cart.clearCart()
  sessionStorage.removeItem('checkout')
  isSuccess.value = true
  message.value = 'سفارش شما ثبت شد...'
})
</script>
