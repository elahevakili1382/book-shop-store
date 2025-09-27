<template>
  <div class="min-h-screen flex">
    <!-- ستون تصویر -->
    <div
      class="hidden md:flex w-1/2 bg-cover bg-center"
      style="background-image: url('/images/6870525.jpg')"
    >
      <!-- لایه نیمه شفاف روی عکس -->
      <!-- <div class="w-full h-full bg-black/30 flex items-center justify-center">
        <h2 class="text-pink-800 text-4xl font-bold"></h2>
      </div> -->
    </div>

    <!-- ستون فرم -->
    <div class="flex-1 flex flex-col justify-center items-center px-6 sm:px-12 py-12 bg-gray-50">
      <!-- لوگو یا عنوان -->
      <h1 class="text-3xl font-bold mb-8 text-gray-800"> ثبت‌نام</h1>

      <!-- تب‌ها -->
      <div class="flex mb-8 border-b w-full max-w-md">
        <button
          class="flex-1 py-2 font-semibold text-center"
          :class="activeTab === 'login' ? 'border-b-2 border-pink-500 text-pink-600' : 'text-gray-500'"
          @click="activeTab = 'login'"
        >
          ورود
        </button>
        <button
          class="flex-1 py-2 font-semibold text-center"
          :class="activeTab === 'signup' ? 'border-b-2 border-pink-500 text-pink-600' : 'text-gray-500'"
          @click="activeTab = 'signup'"
        >
          ثبت‌نام
        </button>
      </div>

      <!-- فرم ورود -->
      <form
        v-if="activeTab === 'login'"
        @submit.prevent="handleLogin"
        class="space-y-4 w-full max-w-md"
        autocomplete="on"
      >
        <input
          v-model="loginData.email"
          type="email"
          class="w-full border px-4 py-3 rounded-lg focus:ring-2 focus:ring-pink-200 outline-none"
          placeholder="ایمیل"
          required
        />
        <input
          v-model="loginData.password"
          type="password"
          class="w-full border px-4 py-3 rounded-lg focus:ring-2 focus:ring-pink-200 outline-none"
          placeholder="رمز عبور"
          required
        />
        <button
          type="submit"
          class="w-full bg-pink-500 text-white py-3 rounded-lg font-semibold hover:bg-pink-600 transition"
        >
          ورود
        </button>
      </form>

      <!-- فرم ثبت‌نام -->
      <form
        v-else
        @submit.prevent="handleSignup"
        class="space-y-4 w-full max-w-md"
                autocomplete="on"

      >
        <input
          v-model="signupData.name"
          type="text"
          class="w-full border px-4 py-3 rounded-lg focus:ring-2 focus:ring-pink-200 outline-none"
          placeholder="نام و نام خانوادگی"
          required
        />
        <input
          v-model="signupData.email"
          type="email"
          class="w-full border px-4 py-3 rounded-lg focus:ring-2 focus:ring-pink-200 outline-none"
          placeholder="ایمیل"
          required
        />
        <input
          v-model="signupData.password"
          type="password"
          class="w-full border px-4 py-3 rounded-lg focus:ring-2 focus:ring-pink-200 outline-none"
          placeholder="رمز عبور"
          required
        />
        <button
          type="submit"
          class="w-full bg-pink-500 text-white py-3 rounded-lg font-semibold hover:bg-pink-600 transition"
        >
          ثبت‌نام
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useToast, useNuxtApp, useState } from '#imports'
interface User {
  id: string
  name: string
  email: string
}
const userState = useState<User | null>("clientUser", () => null)

const toast = useToast()
const nuxtApp = useNuxtApp()

interface AuthorizationPlugin {
  // بهتر resolveClientUser یک تابع بپذیرد که user را دریافت کند
  resolveClientUser?: (user: any) => void
}

const $authorization = nuxtApp.$authorization as AuthorizationPlugin | undefined

const activeTab = ref<'login'|'signup'>('login')

// بهتر reactive برای اشیاء فرم
const loginData = reactive({ email: '', password: '' })
const signupData = reactive({ name: '', email: '', password: '' })

const handleLogin = async () => {
  try {
    const user = { id: '1', name: 'کاربر تست', email: loginData.email }

    // اگر پلاگین وجود دارد و تابع دارد آن را فراخوانی کنید
    if ($authorization && typeof $authorization.resolveClientUser === 'function') {
      $authorization.resolveClientUser(user)
    } else {
      // fallback ساده با useState (بدون نیاز به پلاگین)
const userState = useState<User | null>("clientUser", () => null)
      userState.value = user
    }

    toast.success({
      title: 'موفق',
      message: `${user.name} خوش آمدید `,
      position: 'topRight',
    })
  } catch (err: any) {
    toast.error(err.message || 'خطا در ورود')
  }
}

const handleSignup = async () => {
  try {
    const user = { id: '1', name: signupData.name, email: signupData.email }

    if ($authorization && typeof $authorization.resolveClientUser === 'function') {
      $authorization.resolveClientUser(user)
    } else {
const userState = useState<User | null>("clientUser", () => null)
      userState.value = user
    }

    toast.success({
      title: 'موفق',
      message: `${user.name} جان خوش آمدید `,
      position: 'topRight',
    })

    activeTab.value = 'login'
  } catch (err: any) {
    toast.error(err.message || 'خطا در ثبت‌نام')
  }
}

definePageMeta({ layout: 'auth' })
</script>
