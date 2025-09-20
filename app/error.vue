<template>
  <div class="flex items-center justify-center h-screen bg-gray-50 px-4">
    <div class="bg-white shadow-2xl rounded-3xl p-10 max-w-md w-full text-center transform transition-all hover:scale-105">
      
      <!-- آیکون خطا -->
      <div class="flex justify-center mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-24 w-24 text-red-500 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M12 2a10 10 0 100 20 10 10 0 000-20z"/>
        </svg>
      </div>

      <!-- کد خطا -->
      <h1 class="text-6xl font-extrabold text-red-500 mb-4">
        {{ props.error?.statusCode || 'خطا' }}
      </h1>

      <!-- متن خطا -->
      <p class="text-gray-700 text-base md:text-lg mb-6">
        {{ props.error?.statusMessage || 'صفحه مورد نظر یافت نشد یا موجود نیست.' }}
      </p>

      <!-- دکمه بازگشت -->
      <button
        @click="handleError"
        class="flex items-center justify-center gap-2 bg-[#DCF763] hover:bg-[#c5e450] text-gray-900 font-semibold px-6 py-3 rounded-full shadow-md transition transform hover:scale-105 hover:shadow-lg"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        بازگشت به صفحه اصلی
      </button>

    </div>
  </div>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error?: NuxtError }>()

const handleError = () => clearError({ redirect: '/' })
</script>

<style scoped>
/* می‌توانی افکت‌های اضافی CSS هم اضافه کنی اگر خواستی */
</style>
