<template>
  <header class="flex justify-between items-center px-4 py-4 relative">
    <!-- لوگو -->
    <div class="flex items-center space-x-2 rtl:space-x-reverse">
      <NuxtImg
        src="/images/brandlogo.png"
        alt="Booklet Logo"
        width="154"
        height="40"
        class="w-[154px] h-[40px]"
      />
    </div>

    <!-- منوی موبایل -->
    <button @click="ui.toggleMobileMenu()" class="md:hidden text-gray-800 focus:outline-none">
      <svg
        v-if="!ui.isMobileMenuOpen"
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
      <svg
        v-else
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>

    <!-- منوی دسکتاپ -->
    <nav class="hidden md:flex items-center space-x-6 rtl:space-x-reverse">
      <NuxtLink
        to="/"
        class="font-bold px-6 py-1 bg-[#435058] rounded-full text-white hover:bg-[#0c161dcb] hover:scale-105"
      >
        خانه
      </NuxtLink>
      <NuxtLink to="/" class="font-bold text-gray-600 hover:text-gray-500">دسته بندی ها</NuxtLink>
      <NuxtLink to="/" class="font-bold text-gray-600 hover:text-gray-500">منتخب ها</NuxtLink>
      <NuxtLink to="/" class="font-bold text-gray-600 hover:text-gray-500">تازه ها</NuxtLink>
      <NuxtLink to="/" class="font-bold text-gray-600 hover:text-gray-500">پرفروش ها</NuxtLink>
      <NuxtLink to="/" class="font-bold text-gray-600 hover:text-gray-500">پیشنهاد روز</NuxtLink>
      <NuxtLink to="/" class="font-bold text-gray-600 hover:text-gray-500">درباره ما</NuxtLink>
    </nav>

    <!-- آیکون‌های دسکتاپ -->
    <div class="hidden md:flex items-center gap-2">
      <NuxtLink to="/" class="w-10 h-10 flex items-center justify-center rounded-full bg-gray-700">
        <NuxtImg src="/images/shopping-bag-minus.svg" alt="سبد خرید" width="20" height="20" class="w-5 h-5" />
      </NuxtLink>
      <NuxtLink
        to="/"
        class="w-10 h-10 flex items-center justify-center rounded-full bg-white text-gray-600 outline outline-1"
      >
        <NuxtImg src="/images/favourite.svg" alt="علاقه‌مندی‌ها" width="20" height="20" class="w-5 h-5" />
      </NuxtLink>
      <NuxtLink
        to="/"
        class="box-border flex justify-center items-center px-7 py-[10px] gap-2 w-[120px] h-[35px] bg-[#DCF763] border border-[#435058] rounded-[40px]"
      >
        <NuxtImg src="/images/user-icon.svg" alt="ورود" width="20" height="20" class="w-5 h-5" />
        <span class="text-black text-sm">ورود</span>
      </NuxtLink>
    </div>

    <!-- منوی موبایل بازشونده -->
    <transition name="slide">
      <div v-if="ui.isMobileMenuOpen" class="fixed inset-0 z-40 flex md:hidden">
        <!-- overlay -->
        <div @click="ui.toggleMobileMenu()" class="fixed inset-0 bg-black bg-opacity-50"></div>

        <!-- sidebar -->
        <div class="relative w-64 bg-[#8b8b88b8] p-6 flex flex-col space-y-6 rtl:text-right">
          <nav class="flex flex-col space-y-4">
            <NuxtLink
              to="/"
              @click="ui.closeMobileMenu()"
              class="px-3 py-2 rounded hover:bg-[#5a5a57e5] hover:text-white"
              >خانه</NuxtLink
            >
            <NuxtLink
              to="/"
              @click="ui.closeMobileMenu()"
              class="px-3 py-2 rounded hover:bg-[#5a5a57e5] hover:text-white"
              >دسته‌بندی</NuxtLink
            >
            <NuxtLink
              to="/"
              @click="ui.closeMobileMenu()"
              class="px-3 py-2 rounded hover:bg-[#5a5a57e5] hover:text-white"
              >تازه‌ها</NuxtLink
            >
            <NuxtLink
              to="/"
              @click="ui.closeMobileMenu()"
              class="px-3 py-2 rounded hover:bg-[#5a5a57e5] hover:text-white"
              >پرفروش‌ها</NuxtLink
            >
            <NuxtLink
              to="/"
              @click="ui.closeMobileMenu()"
              class="px-3 py-2 rounded hover:bg-[#5a5a57e5] hover:text-white"
              >پیشنهاد روز</NuxtLink
            >
            <NuxtLink
              to="/"
              @click="ui.closeMobileMenu()"
              class="px-3 py-2 rounded hover:bg-[#5a5a57e5] hover:text-white"
              >تماس با ما</NuxtLink
            >
          </nav>

          <div class="flex items-center gap-3 pt-4 border-t border-gray-300">
            <NuxtLink
              to="/"
              @click="ui.closeMobileMenu()"
              class="w-10 h-10 flex items-center justify-center rounded-full bg-gray-700"
            >
              <NuxtImg src="/images/shopping-bag-minus.svg" alt="سبد خرید" width="20" height="20" class="w-5 h-5" />
            </NuxtLink>
            <NuxtLink
              to="/"
              @click="ui.closeMobileMenu()"
              class="w-10 h-10 flex items-center justify-center rounded-full bg-white text-gray-600 outline outline-1"
            >
              <NuxtImg src="/images/favourite.svg" alt="علاقه‌مندی‌ها" width="20" height="20" class="w-5 h-5" />
            </NuxtLink>
            <NuxtLink
              to="/"
              @click="ui.closeMobileMenu()"
              class="flex justify-center items-center px-4 py-2 gap-2 bg-[#DCF763] border border-[#435058] rounded-full"
            >
              <NuxtImg src="/images/user-icon.svg" alt="ورود" width="20" height="20" class="w-5 h-5" />
              <span class="text-black text-sm">ورود</span>
            </NuxtLink>
          </div>
        </div>
      </div>
    </transition>
  </header>
</template>

<script setup lang="ts">
const ui = useUIStore()
</script>
