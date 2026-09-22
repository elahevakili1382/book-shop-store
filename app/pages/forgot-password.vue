<template>
  <div class="min-h-screen bg-cream">
    <div class="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-12">
      <NuxtLink to="/login" class="mb-8 text-sm font-bold text-slate/50 hover:text-slate">
        بازگشت به ورود
      </NuxtLink>
      <h1 class="text-3xl font-black text-slate">بازیابی رمز</h1>
      <p class="mt-2 text-sm leading-relaxed text-slate/50">
        شماره‌ای که با آن ثبت‌نام کرده‌ای را بنویس. اگر حساب باشد، لینک ۱۵ دقیقه‌ای ساخته می‌شود.
      </p>

      <form class="mt-8 space-y-4" @submit.prevent="submit">
        <label class="block text-sm font-bold text-slate">
          موبایل
          <input
            v-model="phone"
            type="tel"
            required
            inputmode="numeric"
            autocomplete="tel"
            dir="ltr"
            class="mt-1.5 w-full rounded-2xl border border-slate/10 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-lime/60"
            placeholder="09121234567"
          />
        </label>
        <button
          type="submit"
          :disabled="busy"
          class="w-full rounded-2xl bg-slate py-3.5 text-sm font-bold text-white hover:bg-lime hover:text-slate disabled:opacity-50"
        >
          ارسال لینک بازیابی
        </button>
      </form>

      <p v-if="done" class="mt-6 text-sm leading-relaxed text-slate/60">
        اگر این شماره حساب داشته باشد، لینک بازیابی آماده است.
      </p>
      <NuxtLink
        v-if="resetUrl"
        :to="resetUrl"
        class="mt-4 break-all rounded-2xl border border-lime/50 bg-lime/20 px-4 py-3 text-sm font-bold text-slate"
      >
        لینک آزمایشی بازیابی رمز
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { toEnglishDigits } from '../utils/digits'

definePageMeta({
  layout: 'auth',
  middleware: 'guest-only',
})

useSeoMeta({
  title: 'بازیابی رمز | Booklett',
})

const phone = ref('')
const busy = ref(false)
const done = ref(false)
const resetUrl = ref('')
const toast = useToast()

async function submit() {
  busy.value = true
  resetUrl.value = ''
  try {
    const res = await $fetch<{ ok: boolean; resetUrl?: string }>('/api/auth/forgot-password', {
      method: 'POST',
      body: { phone: toEnglishDigits(phone.value) },
    })
    done.value = true
    if (res?.resetUrl) {
      const path = res.resetUrl.replace(window.location.origin, '')
      resetUrl.value = path || res.resetUrl
    }
    toast.success({ message: 'اگر حساب باشد، لینک بازیابی آماده است', position: 'topRight' })
  } catch {
    toast.error('درخواست انجام نشد')
  } finally {
    busy.value = false
  }
}
</script>
