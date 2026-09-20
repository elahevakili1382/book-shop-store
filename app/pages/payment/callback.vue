<template>
  <main class="min-h-screen">
    <div class="mx-auto max-w-[560px] px-4 py-16 text-center">
      <div
        class="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full"
        :class="isSuccess ? 'bg-lime/40 text-slate' : 'bg-slate/10 text-slate/50'"
      >
        <AppIcon :icon="isSuccess ? 'mdi:check' : 'mdi:close'" class="h-8 w-8" />
      </div>
      <h1 class="text-2xl font-black text-slate">
        {{ isSuccess ? 'سفارش ثبت شد' : 'پرداخت انجام نشد' }}
      </h1>
      <p class="mx-auto mt-3 mb-8 max-w-sm text-sm leading-relaxed text-slate/55">
        {{ message }}
      </p>

      <div class="flex flex-col items-center justify-center gap-3 sm:flex-row">
        <NuxtLink
          v-if="isSuccess"
          to="/"
          class="rounded-2xl bg-slate px-6 py-3 text-sm font-bold text-white"
        >
          بازگشت به فروشگاه
        </NuxtLink>
        <template v-else>
          <NuxtLink to="/cart" class="rounded-2xl bg-slate px-6 py-3 text-sm font-bold text-white">
            بازگشت به سبد خرید
          </NuxtLink>
          <NuxtLink
            to="/"
            class="rounded-2xl border border-slate/15 bg-white px-6 py-3 text-sm font-bold text-slate"
          >
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

definePageMeta({ layout: 'default' })

const route = useRoute()
const cart = useCartStore()

const message = ref('در حال بررسی پرداخت...')
const isSuccess = ref(false)

onMounted(async () => {
  if (!import.meta.client) return

  if (String(route.query.cod || '') === 'ok') {
    isSuccess.value = true
    message.value = 'سفارش با پرداخت در محل ثبت شد. هنگام تحویل مبلغ را پرداخت می‌کنی.'
    return
  }

  const status = String(route.query.Status || '')
  const authority = String(route.query.Authority || '')

  if (!authority || status !== 'OK') {
    isSuccess.value = false
    message.value = 'تراکنش تکمیل نشد. اگر مبلغی کم شده، تا چند دقیقه دیگر به حساب برمی‌گردد.'
    try {
      if (authority) {
        await $fetch('/api/payment/complete', {
          method: 'POST',
          body: { authority, status },
        })
      }
    } catch {
      // سفارش در صورت وجود pending می‌ماند یا failed می‌شود
    }
    return
  }

  try {
    const res = await $fetch('/api/payment/complete', {
      method: 'POST',
      body: { authority, status },
    })

    if (res?.ok) {
      cart.clearCart()
      sessionStorage.removeItem('checkout')
      isSuccess.value = true
      message.value = 'پرداخت تأیید شد و موجودی کتاب‌ها به‌روز شد.'
      return
    }

    isSuccess.value = false
    message.value = 'پرداخت تأیید نشد.'
  } catch (err) {
    isSuccess.value = false
    message.value =
      err?.data?.statusMessage || err?.statusMessage || 'تأیید پرداخت ناموفق بود.'
  }
})
</script>
