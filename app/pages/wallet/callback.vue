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
        {{ isSuccess ? 'کیف پول شارژ شد' : 'شارژ انجام نشد' }}
      </h1>
      <p class="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-slate/55">
        {{ message }}
      </p>
      <p v-if="isSuccess" class="mt-6 text-xl font-black text-slate">
        {{ formatPrice(walletBalance) }}
        <span class="text-sm font-bold text-slate/40">تومان</span>
      </p>
      <div class="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <NuxtLink
          to="/account?tab=wallet"
          class="rounded-2xl bg-slate px-6 py-3 text-sm font-bold text-white"
        >
          بازگشت به کیف پول
        </NuxtLink>
        <NuxtLink
          to="/"
          class="rounded-2xl border border-slate/15 bg-white px-6 py-3 text-sm font-bold text-slate"
        >
          فروشگاه
        </NuxtLink>
      </div>
    </div>
  </main>
</template>

<script setup>
import { onMounted, ref } from 'vue'

definePageMeta({
  layout: 'default',
  middleware: 'auth',
})

useSeoMeta({
  title: 'نتیجه شارژ کیف پول',
})

const route = useRoute()
const message = ref('در حال بررسی پرداخت...')
const isSuccess = ref(false)
const walletBalance = ref(0)

function formatPrice(value) {
  return new Intl.NumberFormat('fa-IR').format(value || 0)
}

onMounted(async () => {
  if (!import.meta.client) return

  const status = String(route.query.Status || '')
  const authority = String(route.query.Authority || '')

  if (!authority || status !== 'OK') {
    isSuccess.value = false
    message.value = 'تراکنش تکمیل نشد. اگر مبلغی کم شده، تا چند دقیقه دیگر به حساب برمی‌گردد.'
    try {
      if (authority) {
        await $fetch('/api/wallet/complete', {
          method: 'POST',
          body: { authority, status },
        })
      }
    } catch {
      // pending charge clears on the server when status is not OK
    }
    return
  }

  try {
    const res = await $fetch('/api/wallet/complete', {
      method: 'POST',
      body: { authority, status },
    })

    if (res?.ok) {
      isSuccess.value = true
      walletBalance.value = Number(res.walletBalance || 0)
      message.value = res.alreadyPaid
        ? 'این پرداخت قبلاً اعمال شده. موجودی فعلی همین است.'
        : 'مبلغ به موجودی کیف پول اضافه شد و برای سفارش بعدی قابل استفاده است.'
      return
    }

    isSuccess.value = false
    message.value = 'پرداخت تأیید نشد.'
  } catch (err) {
    isSuccess.value = false
    message.value = err?.data?.statusMessage || err?.statusMessage || 'تأیید شارژ ناموفق بود.'
  }
})
</script>
