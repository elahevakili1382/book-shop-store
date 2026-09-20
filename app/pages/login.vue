<template>
  <div class="min-h-screen bg-cream">
    <div class="grid min-h-screen lg:grid-cols-2">
      <div class="relative hidden overflow-hidden bg-slate lg:flex lg:flex-col lg:justify-between lg:p-12">
        <NuxtLink to="/" class="text-lg font-black text-white">Booklett</NuxtLink>
        <div>
          <p class="text-sm font-bold text-lime">فروشگاه کتاب</p>
          <h2 class="mt-3 max-w-sm text-3xl font-black leading-snug text-white">
            ورود برای پیگیری سفارش، یا داشبورد اگر ادمین هستی
          </h2>
          <p class="mt-4 max-w-sm text-sm leading-relaxed text-white/60">
            خرید بدون حساب هم ممکن است. این صفحه برای ورود ادمین و ثبت‌نام مشتری در محیط توسعه است.
          </p>
        </div>
        <p class="text-xs text-white/40">بازگشت به فروشگاه از لوگوی بالا</p>
      </div>

      <div class="flex flex-col justify-center px-6 py-12 sm:px-12">
        <NuxtLink to="/" class="mb-8 text-sm font-bold text-slate/50 hover:text-slate lg:hidden">
          بازگشت به فروشگاه
        </NuxtLink>

        <h1 class="text-3xl font-black text-slate">{{ isRegister ? 'ثبت‌نام' : 'ورود' }}</h1>
        <p class="mt-2 text-sm text-slate/50">
          {{ isRegister ? 'یک حساب مشتری بساز و بعد وارد شو.' : 'ایمیل و رمز را وارد کن.' }}
        </p>

        <div v-if="canRegister" class="mt-6 grid grid-cols-2 rounded-2xl border border-slate/10 bg-white p-1">
          <button
            type="button"
            class="rounded-xl py-2.5 text-sm font-bold transition-colors"
            :class="!isRegister ? 'bg-slate text-white' : 'text-slate/50 hover:text-slate'"
            @click="isRegister = false"
          >
            ورود
          </button>
          <button
            type="button"
            class="rounded-xl py-2.5 text-sm font-bold transition-colors"
            :class="isRegister ? 'bg-slate text-white' : 'text-slate/50 hover:text-slate'"
            @click="isRegister = true"
          >
            ثبت‌نام
          </button>
        </div>

        <form v-if="isRegister" class="mt-8 space-y-4" autocomplete="on" @submit.prevent="handleRegister">
          <label class="block text-sm font-bold text-slate">
            نام
            <input
              v-model="registerData.name"
              type="text"
              required
              class="mt-1.5 w-full rounded-2xl border border-slate/10 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-lime/60"
              placeholder="نام و نام خانوادگی"
            />
          </label>
          <label class="block text-sm font-bold text-slate">
            ایمیل
            <input
              v-model="registerData.email"
              type="email"
              required
              autocomplete="email"
              class="mt-1.5 w-full rounded-2xl border border-slate/10 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-lime/60"
              placeholder="you@email.com"
            />
          </label>
          <label class="block text-sm font-bold text-slate">
            رمز عبور
            <input
              v-model="registerData.password"
              :type="showPassword ? 'text' : 'password'"
              required
              minlength="6"
              autocomplete="new-password"
              class="mt-1.5 w-full rounded-2xl border border-slate/10 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-lime/60"
              placeholder="حداقل ۶ کاراکتر"
            />
          </label>
          <button
            type="submit"
            :disabled="busy"
            class="w-full rounded-2xl bg-slate py-3.5 text-sm font-bold text-white hover:bg-lime hover:text-slate disabled:opacity-50"
          >
            ساخت حساب
          </button>
        </form>

        <form v-else class="mt-8 space-y-4" autocomplete="on" @submit.prevent="handleLogin()">
          <label class="block text-sm font-bold text-slate">
            ایمیل
            <input
              v-model="loginData.email"
              type="email"
              required
              autocomplete="email"
              class="mt-1.5 w-full rounded-2xl border border-slate/10 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-lime/60"
              placeholder="ایمیل"
            />
          </label>
          <label class="block text-sm font-bold text-slate">
            رمز عبور
            <div class="relative mt-1.5">
              <input
                v-model="loginData.password"
                :type="showPassword ? 'text' : 'password'"
                required
                autocomplete="current-password"
                class="w-full rounded-2xl border border-slate/10 bg-white px-4 py-3 pl-12 text-sm outline-none focus:ring-2 focus:ring-lime/60"
                placeholder="رمز عبور"
              />
              <button
                type="button"
                class="absolute left-3 top-1/2 -translate-y-1/2 text-slate/40 hover:text-slate"
                :aria-label="showPassword ? 'پنهان کردن رمز' : 'نمایش رمز'"
                @click="showPassword = !showPassword"
              >
                <AppIcon :icon="showPassword ? 'mdi:eye-off-outline' : 'mdi:eye-outline'" class="h-5 w-5" />
              </button>
            </div>
          </label>
          <button
            type="submit"
            :disabled="busy"
            class="w-full rounded-2xl bg-slate py-3.5 text-sm font-bold text-white hover:bg-lime hover:text-slate disabled:opacity-50"
          >
            ورود
          </button>
        </form>

        <p v-if="isDev" class="mt-8 rounded-2xl border border-slate/10 bg-white px-4 py-3 text-xs leading-relaxed text-slate/55">
          برای دیدن داشبورد ادمین:
          <span class="font-bold text-slate" dir="ltr">admin@booklett.ir</span>
          با رمز
          <span class="font-bold text-slate" dir="ltr">BooklettAdmin123</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'

const toast = useToast()
const auth = useAuthStore()
const route = useRoute()

const isRegister = ref(false)
const showPassword = ref(false)
const busy = ref(false)
const canRegister = import.meta.dev
const isDev = import.meta.dev

const loginData = reactive({ email: '', password: '' })
const registerData = reactive({ name: '', email: '', password: '' })

function isAdminRole(role?: string) {
  return role === 'admin' || role === 'super-admin'
}

function nextPath(role?: string) {
  const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : ''
  if (redirect.startsWith('/') && !redirect.startsWith('//')) return redirect
  return isAdminRole(role) ? '/dashboard' : '/'
}

function persianAuthError(err: any) {
  const raw = String(err?.data?.statusMessage || err?.statusMessage || err?.message || '')
  const map: Record<string, string> = {
    'User not found': 'ایمیلی با این مشخصات پیدا نشد',
    'Invalid password': 'رمز عبور اشتباه است',
    'Email and password are required': 'ایمیل و رمز را کامل کن',
    'All fields are required': 'همه فیلدها الزامی است',
    'Password must be at least 6 characters': 'رمز باید حداقل ۶ کاراکتر باشد',
    'Email already registered': 'این ایمیل قبلاً ثبت شده',
    'Registration is disabled': 'ثبت‌نام در این محیط بسته است',
  }
  return map[raw] || raw || 'خطا در ورود'
}

async function handleLogin(email?: string, password?: string) {
  busy.value = true
  try {
    const res: any = await $fetch('/api/auth/login', {
      method: 'POST',
      body: {
        email: String(email ?? loginData.email).trim(),
        password: String(password ?? loginData.password),
      },
    })

    if (res?.ok) {
      auth.login(res.user)
      toast.success({
        title: 'موفق',
        message: 'ورود موفقیت‌آمیز بود',
        position: 'topRight',
      })
      await navigateTo(nextPath(res.user?.role))
    }
  } catch (err: any) {
    toast.error(persianAuthError(err))
  } finally {
    busy.value = false
  }
}

async function handleRegister() {
  busy.value = true
  try {
    await $fetch('/api/auth/register', {
      method: 'POST',
      body: {
        name: registerData.name.trim(),
        email: registerData.email.trim(),
        password: registerData.password,
      },
    })
    await handleLogin(registerData.email, registerData.password)
  } catch (err: any) {
    toast.error(persianAuthError(err))
    busy.value = false
  }
}

definePageMeta({
  layout: 'auth',
  middleware: 'guest-only',
})
</script>
