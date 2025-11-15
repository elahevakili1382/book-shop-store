<template>
  <header class="flex items-center justify-between px-4 py-4 relative">

    <!-- لوگو -->
    <div class="flex items-center space-x-2 rtl:space-x-reverse">
      <NuxtImg src="/images/brandlogo.png" alt="Booklet Logo" width="154" height="40" />
    </div>

    <!-- منوی موبایل -->
    <button @click="ui.toggleMobileMenu()" class="order-1 md:hidden text-gray-800 focus:outline-none">
      <svg v-if="!ui.isMobileMenuOpen" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none"
        viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
      </svg>

      <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none"
        viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>

    <!-- منوی دسکتاپ -->
    <nav class="hidden md:flex items-center space-x-7 rtl:space-x-reverse">
      <NuxtLink to="/" class="font-bold px-5 py-1 bg-[#435058] rounded-full text-white hover:bg-[#0c161dcb] hover:scale-105">
        خانه
      </NuxtLink>
      <NuxtLink to="/new" class="font-bold text-gray-600 hover:text-gray-500">تازه ها</NuxtLink>
      <NuxtLink to="/bestseller" class="font-bold text-gray-600 hover:text-gray-500">پرفروش ها</NuxtLink>
      <NuxtLink to="/daily-offers" class="font-bold text-gray-600 hover:text-gray-500">پیشنهاد روز</NuxtLink>
      <NuxtLink to="/about" class="font-bold text-gray-600 hover:text-gray-500">درباره ما</NuxtLink>
    </nav>

    <!-- سرچ دسکتاپ -->
    <div class="hidden md:block relative flex-1 max-w-md md:mx-4" v-click-outside="closeDropdown">
      
      <input
        v-model="searchQuery"
        @input="handleInput"
        type="text"
        placeholder="جست و جو..."
        class="w-full rounded-lg pr-10 pl-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
      />

      <!-- آیکون سرچ -->
      <FontAwesome icon="search" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-800" />

      <!-- اگر عبارت وارد شده و نیاز به پاک کردن بود -->
      <button
        v-if="searchQuery"
        @click="clearSearch"
        type="button"
        class="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-600 hover:text-gray-800"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none"
          viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <!-- DROPDOWN -->
      <transition name="fade">
        <div
          v-if="isDropdownVisible"
          class="absolute top-full left-0 right-0 mt-1 bg-white shadow-xl rounded-lg z-10 max-h-80 overflow-y-auto border border-gray-100"
        >
          <ul>
            <li
              v-for="p in store.products"
              :key="p.id"
              class="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 cursor-pointer transition hover:scale-105"
              @click="goToProduct(p.id)"
            >
              <NuxtImg
                :src="p.image || '/images/default-book.jpg'"
                alt="p.title"
                width="50"
                height="70"
                class="flex-shrink-0 rounded"
              />

              <div class="flex-1">
                <h3 class="text-sm font-medium text-gray-800 truncate">{{ p.title }}</h3>
                <p class="text-xs text-gray-500 truncate">{{ p.category }}</p>
              </div>

              <span class="text-sm font-semibold text-gray-900">
                {{ formatPrice(p.price) }}
              </span>
            </li>

            <li v-if="store.isLoading" class="px-4 py-2 text-gray-400 text-center">در حال جستجو...</li>
            <li v-if="store.error" class="px-4 py-2 text-red-500 text-center">{{ store.error }}</li>
            <li v-if="!store.isLoading && !store.products.length && searchQuery"
              class="px-4 py-2 text-gray-500 text-center">محصولی یافت نشد</li>
          </ul>
        </div>
      </transition>
    </div>

    <!-- سرچ موبایل -->
    <div class="md:hidden relative" v-click-outside="closeDropdown">
      <button
        @click="isMobileSearchOpen = !isMobileSearchOpen"
        class="p-2 text-gray-700">
        <FontAwesome icon="search" class="w-6 h-6" />
      </button>

      <transition name="fade">
        <div
          v-if="isMobileSearchOpen"
          class="absolute top-full left-0 mt-2 w-64 z-50"
        >
          <input
            v-model="searchQuery"
            @input="handleInput"
            type="text"
            placeholder="جست‌وجو..."
            class="w-full rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white shadow-md"
          />

          <transition name="fade">
            <div
              v-if="isDropdownVisible"
              class="absolute top-full left-0 right-0 mt-1 bg-white shadow-xl rounded-lg z-50 max-h-80 overflow-y-auto border border-gray-100"
            >
              <ul>
                <li
                  v-for="p in store.products"
                  :key="p.id"
                  class="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 cursor-pointer transition hover:scale-105"
                  @click="goToProduct(p.id)"
                >
                  <NuxtImg
                    :src="p.image || '/images/default-book.jpg'"
                    alt="p.title"
                    width="50"
                    height="70"
                    class="flex-shrink-0 rounded"
                  />
                  <div class="flex-1">
                    <h3 class="text-sm font-medium text-gray-800 truncate">{{ p.title }}</h3>
                    <p class="text-xs text-gray-500 truncate">{{ p.category }}</p>
                  </div>
                  <span class="text-sm font-semibold text-gray-900">
                    {{ formatPrice(p.price) }}
                  </span>
                </li>
              </ul>
            </div>
          </transition>
        </div>
      </transition>
    </div>

    <!-- آیکون سبد + علاقه‌مندی -->
    <div class="hidden md:flex items-center gap-2">
      <NuxtLink to="/cart" class="bg-[#1C2B36] relative w-10 h-10 flex items-center justify-center rounded-full">
        <NuxtImg src="/images/shopping-bag-minus.svg" width="20" height="20" />
        <span v-if="cart.cartCount"
          class="absolute -bottom-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
          {{ cart.cartCount }}
        </span>
      </NuxtLink>

      <NuxtLink to="/" class="w-10 h-10 flex items-center justify-center rounded-full bg-white text-gray-600 outline">
        <NuxtImg src="/images/favourite.svg" width="20" height="20" />
      </NuxtLink>

      <NuxtLink to="/login" class="flex justify-center items-center px-7 py-[10px] gap-2 w-[120px] h-[35px] bg-[#DCF763] border border-[#435058] rounded-[40px]">
        <NuxtImg src="/images/user-icon.svg" width="20" height="20" />
        <span class="text-black text-sm">ورود</span>
      </NuxtLink>
    </div>

    <!-- منوی موبایل -->
    <transition name="slide" 
      enter-active-class="transition-transform duration-300 ease-out"
  enter-from-class="-translate-x-full"
  enter-to-class="translate-x-0"
  leave-active-class="transition-transform duration-200 ease-in"
  leave-from-class="translate-x-0"
  leave-to-class="-translate-x-full">
      <div v-if="ui.isMobileMenuOpen" class="fixed inset-0 z-40 flex md:hidden">
        <div @click="ui.toggleMobileMenu()" class="fixed inset-0 bg-black/40 backdrop-blur-sm"></div>

        <div class="relative w-64 bg-[#8b8b88b8] p-6 flex flex-col space-y-6 rtl:text-right">
          <nav class="flex flex-col space-y-4">
            <NuxtLink to="/" @click="ui.closeMobileMenu()" class="px-3 py-2 rounded hover:bg-[#5a5a57e5] hover:text-white">خانه</NuxtLink>
            <NuxtLink to="/new" @click="ui.closeMobileMenu()" class="px-3 py-2 rounded hover:bg-[#5a5a57e5] hover:text-white">تازه‌ها</NuxtLink>
            <NuxtLink to="/bestseller" @click="ui.closeMobileMenu()" class="px-3 py-2 rounded hover:bg-[#5a5a57e5] hover:text-white">پرفروش‌ها</NuxtLink>
            <NuxtLink to="/daily-offers" @click="ui.closeMobileMenu()" class="px-3 py-2 rounded hover:bg-[#5a5a57e5] hover:text-white">پیشنهاد روز</NuxtLink>
            <NuxtLink to="/about" @click="ui.closeMobileMenu()" class="px-3 py-2 rounded hover:bg-[#5a5a57e5] hover:text-white">درباره ما</NuxtLink>
          </nav>

          <div class="flex items-center gap-3 pt-4 border-t border-gray-300">
            <NuxtLink to="/cart" @click="ui.closeMobileMenu()" class="relative w-10 h-10 flex items-center justify-center rounded-full bg-gray-700">
              <NuxtImg src="/images/shopping-bag-minus.svg" width="20" height="20" />
              <span v-if="cart.cartCount" class="absolute -bottom-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">{{ cart.cartCount }}</span>
            </NuxtLink>
            <NuxtLink to="/" @click="ui.closeMobileMenu()" class="w-10 h-10 flex items-center justify-center rounded-full bg-white text-gray-600 outline">
              <NuxtImg src="/images/favourite.svg" width="20" height="20" />
            </NuxtLink>
            <NuxtLink to="/login" @click="ui.closeMobileMenu()" class="flex justify-center items-center px-4 py-2 gap-2 bg-[#DCF763] border border-[#435058] rounded-full">
              <NuxtImg src="/images/user-icon.svg" width="20" height="20" />
              <span class="text-black text-sm">ورود</span>
            </NuxtLink>
          </div>
        </div>
      </div>
    </transition>
  </header>
</template>

<script setup lang="ts">
import { ref, computed } from "vue"
import { useCartStore } from "@/stores/cart"
import { useProductStore } from "@/stores/productStore"
import { useUIStore } from "@/stores/ui"
import { useRouter } from "vue-router"

const ui = useUIStore()
const cart = useCartStore()
const store = useProductStore()
const router = useRouter()

const searchQuery = ref("")
const isMobileSearchOpen = ref(false)
const typing = ref(false)

// debounce timer
let timer: ReturnType<typeof setTimeout> | null = null

// --- Handle Search Input (debounce)
const handleInput = () => {
  typing.value = true

  if (timer) clearTimeout(timer)

  if (!searchQuery.value.trim()) {
    store.products = []
    return
  }

  timer = setTimeout(async () => {
    await store.searchProducts(searchQuery.value)
    typing.value = false
  }, 400)
}

// --- Clear Search
const clearSearch = () => {
  searchQuery.value = ""
  store.products = []
}

// --- Go To Product
const goToProduct = (id: string) => {
  clearSearch()
  router.push(`/product/${id}`)
}

// --- Format Price
const formatPrice = (price: number) =>
  new Intl.NumberFormat("fa-IR").format(price) + " تومان"

// --- Visibility of Dropdown
const isDropdownVisible = computed(
  () => searchQuery.value.trim() && store.products.length
)

// --- Close Dropdown
const closeDropdown = () => {
  store.products = []
}
</script>
<style scoped>

/* --- Fade Soft --- */
.fade-enter-active, .fade-leave-active {
  transition: opacity .25s ease, transform .25s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(-6px) scale(.98);
}
.fade-enter-to, .fade-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
}

/* --- Slide for mobile menu --- */
.slide-enter-active, .slide-leave-active {
  transition: all .35s cubic-bezier(0.22, 1, 0.36, 1);
}
.slide-enter-from {
  transform: translateX(-100%);
}
.slide-enter-to {
  transform: translateX(0);
}
.slide-leave-from {
  transform: translateX(0);
}
.slide-leave-to {
  transform: translateX(-100%);
}

/* --- Links desktop hover --- */
nav a {
  position: relative;
  transition: color .25s ease, transform .25s ease;
}
nav a:hover {
  transform: translateY(-1px) scale(1.06);
}

nav a::after {
  content: "";
  position: absolute;
  height: 2px;
  width: 0;
  bottom: -4px;
  right: 0;
  background: #4e5dff;
  border-radius: 2px;
  transition: width .25s ease;
}
nav a:hover::after {
  width: 100%;
}

/* --- Search Input Focus --- */
input[type="text"] {
  transition: all .25s ease;
  border: 1px solid transparent;
}
input[type="text"]:focus {
  transform: scale(1.015);
  border-color: #6b8cff;
  box-shadow: 0 0 0 4px rgba(107, 140, 255, 0.15);
}

/* --- dropdown results hover --- */
ul li {
  transition: all .2s ease;
}
ul li:hover {
  background-color: #f5f5f5;
  transform: translateX(-4px) scale(1.02);
}

/* --- scroll style --- */
.max-h-80::-webkit-scrollbar {
  width: 6px;
}
.max-h-80::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 4px;
}
.max-h-80::-webkit-scrollbar-thumb:hover {
  background: #aaa;
}

/* --- Mobile slide menu polished background --- */
.fixed.inset-0.bg-black {
  backdrop-filter: blur(2px);
}

.bg-#8b8b88b8 {
  backdrop-filter: blur(12px);
  background: rgba(140, 140, 138, 0.65);
  box-shadow: 0 8px 20px rgba(0,0,0,.25);
  border-radius: 0 12px 12px 0;
} 

/* --- bounce animation for mobile items --- */
nav.flex.flex-col a {
  transition: all .25s cubic-bezier(.34,1.56,.64,1);
}
nav.flex.flex-col a:hover {
  transform: translateX(6px);
}

/* --- Search dropdown container smooth shadow --- */
.shadow-xl {
  box-shadow: 0px 10px 25px rgba(0,0,0,0.18) !important;
}

/* --- Icon hover animations --- */
.w-10.h-10 {
  transition: transform .25s cubic-bezier(.2, .8, .4, 1);
}
.w-10.h-10:hover {
  transform: scale(1.12);
}

</style>

