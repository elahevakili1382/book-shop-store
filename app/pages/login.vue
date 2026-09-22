<template>
  <div class="min-h-screen bg-cream">
    <div class="grid min-h-screen lg:grid-cols-2">
      <div class="relative hidden overflow-hidden bg-slate lg:flex lg:flex-col lg:justify-between lg:p-12">
        <NuxtLink to="/" class="text-lg font-black text-white">Booklett</NuxtLink>
        <div>
          <p class="text-sm font-bold text-lime">فروشگاه کتاب</p>
          <h2 class="mt-3 max-w-sm text-3xl font-black leading-snug text-white">
            فروشگاه نمونه کار Booklett
          </h2>
          <p class="mt-4 max-w-sm text-sm leading-relaxed text-white/60">
            مشتری با موبایل وارد می‌شود. اگر کارفرما هستی، ورود نمایشی داشبورد پایین فرم است.
          </p>
        </div>
        <p class="text-xs text-white/40">بازگشت به فروشگاه از لوگوی بالا</p>
      </div>

      <div class="flex flex-col justify-center px-6 py-12 sm:px-12">
        <NuxtLink to="/" class="mb-8 text-sm font-bold text-slate/50 hover:text-slate lg:hidden">
          بازگشت به فروشگاه
        </NuxtLink>

        <h1 class="text-3xl font-black text-slate">{{ isRegister ? 'ساخت حساب' : 'خوش آمدی' }}</h1>
        <p class="mt-2 text-sm text-slate/50">
          {{ isRegister ? 'نام، موبایل و رمز را بنویس.' : 'با شماره موبایل وارد شو.' }}
        </p>

        <div class="mt-6 grid grid-cols-2 rounded-2xl bg-white p-1 border border-slate/10">
          <button
            type="button"
            class="rounded-xl py-2.5 text-sm font-bold transition-colors"
            :class="!isRegister ? 'bg-slate text-white shadow-sm' : 'text-slate/50 hover:text-slate'"
            @click="isRegister = false"
          >
            ورود
          </button>
          <button
            type="button"
            class="rounded-xl py-2.5 text-sm font-bold transition-colors"
            :class="isRegister ? 'bg-slate text-white shadow-sm' : 'text-slate/50 hover:text-slate'"
            @click="isRegister = true"
          >
            ثبت‌نام
          </button>
        </div>

        <p v-if="generalError" class="mt-4 flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-600">
          <AppIcon icon="mdi:alert-circle-outline" class="h-4 w-4 shrink-0" />
          {{ generalError }}
        </p>

        <form v-if="isRegister" class="mt-6 space-y-4" autocomplete="on" @submit.prevent="handleRegister">
          <label class="block text-sm font-bold text-slate">
            نام و نام خانوادگی
            <div class="relative mt-1.5">
              <AppIcon icon="mdi:account-outline" class="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate/35" />
              <input
                v-model="registerData.name"
                type="text"
                required
                autocomplete="name"
                class="w-full rounded-2xl border border-slate/10 bg-white py-3 pr-11 pl-4 text-sm outline-none focus:ring-2 focus:ring-lime/60"
                placeholder="نام کامل"
              />
            </div>
          </label>

          <label class="block text-sm font-bold text-slate">
            موبایل
            <div class="relative mt-1.5">
              <AppIcon icon="mdi:cellphone" class="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate/35" />
              <input
                v-model="registerData.phone"
                type="tel"
                required
                inputmode="numeric"
                autocomplete="tel"
                dir="ltr"
                class="w-full rounded-2xl border border-slate/10 bg-white py-3 pr-4 pl-11 text-sm outline-none focus:ring-2 focus:ring-lime/60"
                placeholder="09121234567"
              />
            </div>
          </label>

          <AuthPasswordField
            v-model="registerData.password"
            label="رمز عبور"
            placeholder="حداقل ۶ کاراکتر"
            autocomplete="new-password"
            show-strength
          />

          <AuthPasswordField
            v-model="registerData.confirm"
            label="تکرار رمز"
            placeholder="همان رمز را دوباره بنویس"
            autocomplete="new-password"
          />

          <button
            type="submit"
            :disabled="busy"
            class="w-full rounded-2xl bg-slate py-3.5 text-sm font-bold text-white hover:bg-lime hover:text-slate disabled:opacity-50"
          >
            {{ busy ? 'در حال ساخت...' : 'ساخت حساب' }}
          </button>
        </form>

        <form v-else class="mt-6 space-y-4" autocomplete="on" @submit.prevent="handleLogin()">
          <label class="block text-sm font-bold text-slate">
            موبایل
            <div class="relative mt-1.5">
              <AppIcon icon="mdi:cellphone" class="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate/35" />
              <input
                v-model="loginData.phone"
                type="text"
                required
                inputmode="tel"
                autocomplete="tel"
                dir="ltr"
                class="w-full rounded-2xl border border-slate/10 bg-white py-3 pr-4 pl-11 text-sm outline-none focus:ring-2 focus:ring-lime/60"
                placeholder="09121234567"
              />
            </div>
          </label>
          <AuthPasswordField
            v-model="loginData.password"
            label="رمز عبور"
            placeholder="رمز عبور"
            autocomplete="current-password"
          />
          <div class="flex justify-end">
            <NuxtLink to="/forgot-password" class="text-xs font-bold text-slate/50 hover:text-slate">
              رمز را فراموش کرده‌ام
            </NuxtLink>
          </div>
          <button
            type="submit"
            :disabled="busy"
            class="w-full rounded-2xl bg-slate py-3.5 text-sm font-bold text-white hover:bg-lime hover:text-slate disabled:opacity-50"
          >
            {{ busy ? 'در حال ورود...' : 'ورود' }}
          </button>
        </form>

        <aside
          id="demo"
          class="mt-8 rounded-2xl border border-slate/10 bg-white p-4 sm:p-5"
        >
          <p class="text-xs font-bold text-lime-700">نمونه کار</p>
          <h2 class="mt-1 text-base font-black text-slate">دیدن داشبورد ادمین</h2>
          <p class="mt-1.5 text-xs leading-relaxed text-slate/50">
            این فروشگاه برای پورتفولیو است. کارفرما می‌تواند پنل مدیریت را بدون ساخت حساب ببیند.
          </p>
          <button
            type="button"
            :disabled="busy"
            class="mt-4 w-full rounded-2xl border border-slate/15 bg-cream py-3 text-sm font-bold text-slate hover:bg-lime disabled:opacity-50"
            @click="demoAdminLogin"
          >
            {{ busy ? 'در حال ورود...' : 'ورود نمایشی به داشبورد' }}
          </button>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { isIranMobile, toEnglishDigits } from '../utils/digits'

const toast = useToast()
const auth = useAuthStore()
const route = useRoute()

const isRegister = ref(false)
const busy = ref(false)
const generalError = ref('')

const loginData = reactive({ phone: '', password: '' })
const registerData = reactive({ name: '', phone: '', password: '', confirm: '' })

function isAdminRole(role?: string) {
  return role === 'admin' || role === 'super-admin'
}

function nextPath(role?: string) {
  const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : ''
  if (redirect.startsWith('/') && !redirect.startsWith('//')) return redirect
  return isAdminRole(role) ? '/dashboard' : '/account'
}

function persianAuthError(err: any) {
  const raw = String(err?.data?.message || err?.data?.statusMessage || err?.statusMessage || err?.message || '')
  const map: Record<string, string> = {
    'User not found': 'حسابی با این مشخصات پیدا نشد',
    'Invalid password': 'رمز عبور اشتباه است',
    'ایمیل و رمز را کامل کن': 'موبایل و رمز را کامل کن',
    'Email and password are required': 'موبایل و رمز را کامل کن',
    'All fields are required': 'همه فیلدها الزامی است',
    'Password must be at least 6 characters': 'رمز باید حداقل ۶ کاراکتر باشد',
    'Email already registered': 'این شماره قبلاً ثبت شده',
    'Registration is disabled': 'ثبت‌نام در این محیط بسته است',
  }
  return map[raw] || raw || 'خطا در ورود'
}

async function handleLogin(phone?: string, password?: string) {
  busy.value = true
  generalError.value = ''
  try {
    const res: any = await $fetch('/api/auth/login', {
      method: 'POST',
      body: {
        phone: String(phone ?? loginData.phone).trim(),
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
    generalError.value = persianAuthError(err)
    toast.error(generalError.value)
  } finally {
    busy.value = false
  }
}

async function demoAdminLogin() {
  await handleLogin('admin@booklett.ir', 'BooklettAdmin123')
}

async function handleRegister() {
  generalError.value = ''
  const phone = toEnglishDigits(registerData.phone)
  if (!isIranMobile(phone)) {
    generalError.value = 'موبایل را با ۰۹ و ۱۱ رقم وارد کن'
    toast.error(generalError.value)
    return
  }
  if (registerData.password !== registerData.confirm) {
    generalError.value = 'رمز و تکرار آن یکی نیستند'
    toast.error(generalError.value)
    return
  }
  busy.value = true
  try {
    await $fetch('/api/auth/register', {
      method: 'POST',
      body: {
        name: registerData.name.trim(),
        phone,
        password: registerData.password,
      },
    })
    await handleLogin(phone, registerData.password)
  } catch (err: any) {
    generalError.value = persianAuthError(err)
    toast.error(generalError.value)
    busy.value = false
  }
}

definePageMeta({
  layout: 'auth',
  middleware: 'guest-only',
})

useSeoMeta({
  title: 'ورود | Booklett',
})
</script>
