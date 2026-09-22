<template>
  <div class="min-h-screen bg-cream">
    <div class="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-12">
      <NuxtLink to="/forgot-password" class="mb-8 text-sm font-bold text-slate/50 hover:text-slate">
        درخواست لینک جدید
      </NuxtLink>
      <h1 class="text-3xl font-black text-slate">رمز جدید</h1>
      <p class="mt-2 text-sm text-slate/50">رمز تازه را دو بار بنویس. بعد وارد حساب می‌شوی.</p>

      <form class="mt-8 space-y-4" @submit.prevent="submit">
        <label class="block text-sm font-bold text-slate">
          رمز جدید
          <input
            v-model="password"
            type="password"
            required
            minlength="6"
            autocomplete="new-password"
            class="mt-1.5 w-full rounded-2xl border border-slate/10 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-lime/60"
          />
        </label>
        <label class="block text-sm font-bold text-slate">
          تکرار رمز
          <input
            v-model="confirm"
            type="password"
            required
            minlength="6"
            autocomplete="new-password"
            class="mt-1.5 w-full rounded-2xl border border-slate/10 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-lime/60"
          />
        </label>
        <p v-if="mismatch" class="text-sm font-bold text-red-500">دو رمز یکسان نیستند</p>
        <button
          type="submit"
          :disabled="busy || !token"
          class="w-full rounded-2xl bg-slate py-3.5 text-sm font-bold text-white hover:bg-lime hover:text-slate disabled:opacity-50"
        >
          ذخیره و ورود
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

definePageMeta({
  layout: 'auth',
})

useSeoMeta({
  title: 'رمز جدید | Booklett',
})

const route = useRoute()
const auth = useAuthStore()
const toast = useToast()
const token = computed(() => String(route.query.token || ''))
const password = ref('')
const confirm = ref('')
const busy = ref(false)
const mismatch = computed(() => confirm.value.length > 0 && password.value !== confirm.value)

async function submit() {
  if (!token.value) {
    toast.error('لینک بازیابی ناقص است')
    return
  }
  if (password.value !== confirm.value) {
    toast.error('دو رمز یکسان نیستند')
    return
  }
  busy.value = true
  try {
    const res: any = await $fetch('/api/auth/reset-password', {
      method: 'POST',
      body: { token: token.value, password: password.value },
    })
    if (res?.ok && res.user) {
      auth.login(res.user)
      toast.success({ message: 'رمز عوض شد', position: 'topRight' })
      const role = res.user.role
      await navigateTo(role === 'admin' || role === 'super-admin' ? '/dashboard' : '/account')
    }
  } catch (err: any) {
    toast.error(err?.data?.statusMessage || 'بازیابی ناموفق بود')
  } finally {
    busy.value = false
  }
}
</script>
