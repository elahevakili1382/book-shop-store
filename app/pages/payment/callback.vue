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
      <p class="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-slate/55">
        {{ message }}
      </p>

      <div
        v-if="isSuccess && orderId"
        class="mx-auto mt-6 rounded-2xl border border-slate/10 bg-white px-4 py-4"
      >
        <p class="text-xs font-bold text-slate/45">شماره سفارش</p>
        <p class="mt-1 font-black tracking-wide text-slate" dir="ltr">{{ displayOrderId }}</p>
        <p class="mt-2 text-xs leading-relaxed text-slate/45">
          این شماره را نگه دار. با آن می‌توانی سفارش را پیگیری کنی.
        </p>
      </div>

      <div class="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <NuxtLink
          v-if="isSuccess && auth.isAuthenticated"
          to="/account"
          class="rounded-2xl bg-slate px-6 py-3 text-sm font-bold text-white"
        >
          پیگیری در پنل کاربری
        </NuxtLink>
        <NuxtLink
          v-else-if="isSuccess"
          to="/"
          class="rounded-2xl bg-slate px-6 py-3 text-sm font-bold text-white"
        >
          بازگشت به فروشگاه
        </NuxtLink>
        <template v-else>
          <NuxtLink to="/payment" class="rounded-2xl bg-slate px-6 py-3 text-sm font-bold text-white">
            تلاش دوباره
          </NuxtLink>
          <NuxtLink
            to="/cart"
            class="rounded-2xl border border-slate/15 bg-white px-6 py-3 text-sm font-bold text-slate"
          >
            سبد خرید
          </NuxtLink>
        </template>
      </div>
    </div>
  </main>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { useCartStore } from '../../stores/cart'
import { loadCheckout, clearCheckout } from '../../utils/checkout'

definePageMeta({ layout: 'default' })

useSeoMeta({
  title: 'رسید سفارش',
})

const route = useRoute()
const cart = useCartStore()
const auth = useAuthStore()

const message = ref('در حال بررسی پرداخت...')
const isSuccess = ref(false)
const orderId = ref('')

const displayOrderId = computed(() => {
  const id = orderId.value
  if (!id) return ''
  return id.length > 8 ? id.slice(-8).toUpperCase() : id
})

onMounted(async () => {
  if (!import.meta.client) return

  const draft = loadCheckout()
  if (draft.orderId) orderId.value = draft.orderId

  if (String(route.query.cod || '') === 'ok') {
    isSuccess.value = true
    orderId.value = String(route.query.order || draft.orderId || '')
    message.value =
      String(route.query.wallet || '') === '1'
        ? 'سفارش با کیف پول ثبت شد. مبلغ از موجودی کم شد و سفارش در صف ارسال است.'
        : 'سفارش با پرداخت در محل ثبت شد. هنگام تحویل مبلغ را پرداخت می‌کنی.'
    clearCheckout()
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
      orderId.value = res.orderId || draft.orderId || ''
      clearCheckout()
      isSuccess.value = true
      message.value = 'پرداخت تأیید شد. موجودی کتاب‌ها به‌روز شد و سفارش در صف ارسال است.'
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
