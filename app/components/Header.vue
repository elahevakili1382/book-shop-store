<template>
  <header class="header-root sticky top-0 z-50 border-b border-slate/8 bg-white/85 backdrop-blur-md">
    <div
      class="max-w-[1280px] mx-auto w-full px-4 sm:px-8 h-[4.25rem] flex items-center justify-between gap-3 md:gap-4"
    >
      <!-- logo — موبایل: راست | دسکتاپ: همان -->
      <NuxtLink to="/" class="shrink-0 flex items-center">
        <ClientOnly>
          <NuxtImg
            src="/images/brandlogo.png"
            alt="Booklet Logo"
            width="140"
            height="36"
            class="block h-9 w-auto max-w-[140px] object-contain object-right"
          />
        </ClientOnly>
      </NuxtLink>

      <!-- desktop nav -->
      <nav class="hidden md:flex items-center gap-2 shrink-0">
        <NuxtLink to="/" :class="navLinkClass('/')">خانه</NuxtLink>

        <div class="relative group">
          <button
            type="button"
            class="px-4 py-2 rounded-full text-sm font-bold text-slate/60 hover:text-slate hover:bg-white/70 transition-colors"
          >
            دسته‌بندی‌ها
          </button>
          <div
            class="absolute right-0 top-full pt-2 hidden group-hover:block min-w-[220px] z-50"
          >
            <div class="rounded-2xl bg-white border border-slate/10 shadow-card py-2 overflow-hidden">
              <NuxtLink
                v-for="cat in categoryStore.categories"
                :key="cat.slug"
                :to="`/category/${cat.slug}`"
                class="block px-4 py-2.5 text-sm text-slate/70 hover:bg-cream hover:text-slate transition-colors"
              >
                {{ cat.name }}
                <span class="text-slate/40 text-xs">({{ cat.items }})</span>
              </NuxtLink>
            </div>
          </div>
        </div>

        <NuxtLink to="/new" :class="navLinkClass('/new')">تازه‌ها</NuxtLink>
        <NuxtLink to="/bestseller" :class="navLinkClass('/bestseller')">پرفروش‌ها</NuxtLink>
        <NuxtLink to="/daily-offers" :class="navLinkClass('/daily-offers')">پیشنهاد روز</NuxtLink>
        <NuxtLink to="/about" :class="navLinkClass('/about')">درباره ما</NuxtLink>
      </nav>



      <!-- desktop search -->
      <div class="hidden md:block relative flex-1 max-w-md" click-outside="closeDropdown">
        <AppIcon
          icon="mdi:magnify"
          class="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate/40 pointer-events-none"
        />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="جستجو..."
          class="w-full rounded-2xl py-2.5 pr-10 pl-3 bg-cream/80 border border-slate/10 text-right text-sm focus:outline-none focus:ring-1 focus:ring-slate/20"
          @input="handleInput"
        />
        <button
          v-if="searchQuery"
          type="button"
          class="absolute left-3 top-1/2 -translate-y-1/2 text-slate/50 hover:text-slate"
          @click="clearSearch"
        >
          <AppIcon icon="mdi:close" class="w-4 h-4" />
        </button>

        <transition name="fade">
          <div
            v-if="isDropdownVisible"
            class="absolute top-full left-0 right-0 mt-2 bg-white shadow-card rounded-2xl z-10 max-h-80 overflow-y-auto border border-slate/10"
          >
            <ul>
              <li
                v-for="p in store.products"
                :key="p._id"
                class="flex items-center gap-3 px-4 py-3 hover:bg-cream cursor-pointer transition-colors"
                @click="goToProduct(p)"
              >
                <ClientOnly>
                  <NuxtImg
                    :src="p.image || '/images/default-book.jpg'"
                    :alt="p.title"
                    width="40"
                    height="56"
                    class="shrink-0 rounded-lg object-cover"
                  />
                </ClientOnly>
                <div class="flex-1 min-w-0 text-right">
                  <h3 class="text-sm font-semibold text-slate truncate">{{ p.title }}</h3>
                  <p class="text-xs text-slate/50 truncate">{{ p.category }}</p>
                </div>
                <span class="text-xs font-bold text-slate shrink-0">{{ formatPrice(p.price) }}</span>
              </li>
              <li v-if="store.isLoading" class="px-4 py-3 text-slate/50 text-center text-sm">در حال جستجو...</li>
              <li v-if="store.error" class="px-4 py-3 text-red-500 text-center text-sm">{{ store.error }}</li>
              <li
                v-if="!store.isLoading && !store.products.length && searchQuery"
                class="px-4 py-3 text-slate/50 text-center text-sm"
              >
                محصولی یافت نشد
              </li>
            </ul>
          </div>
        </transition>
      </div>

      <!-- mobile: چپ صفحه — جستجو + منو -->
      <div class="relative flex md:hidden items-center gap-0.5 shrink-0">
        <button
          type="button"
          class="p-2 text-slate rounded-full hover:bg-cream"
          aria-label="جستجو"
          @click="isMobileSearchOpen = !isMobileSearchOpen"
        >
          <AppIcon icon="mdi:magnify" class="w-5 h-5" />
        </button>
        <button
          type="button"
          class="p-2 text-slate rounded-full hover:bg-cream"
          aria-label="منو"
          @click="ui.toggleMobileMenu()"
        >
          <AppIcon :icon="ui.isMobileMenuOpen ? 'mdi:close' : 'mdi:menu'" class="w-6 h-6" />
        </button>

        <transition name="fade">
          <div
            v-if="isMobileSearchOpen"
            class="fixed top-[4.25rem] inset-x-4 z-50"
            click-outside="closeDropdown"
          >
            <input
              v-model="searchQuery"
              type="text"
              placeholder="جستجو..."
              class="w-full rounded-2xl px-3 py-2.5 bg-white border border-slate/10 shadow-card text-sm text-right focus:outline-none focus:ring-1 focus:ring-slate/20"
              @input="handleInput"
            />
            <div
              v-if="isDropdownVisible"
              class="mt-2 bg-white shadow-card rounded-2xl border border-slate/10 max-h-64 overflow-y-auto"
            >
              <ul>
                <li
                  v-for="p in store.products"
                  :key="p._id"
                  class="px-4 py-2.5 text-sm text-slate hover:bg-cream cursor-pointer text-right"
                  @click="goToProduct(p)"
                >
                  {{ p.title }}
                </li>
              </ul>
            </div>
          </div>
        </transition>
      </div>

      <!-- actions -->
      <div class="hidden md:flex items-center gap-2 shrink-0">
        <NuxtLink
          to="/cart"
          class="relative w-10 h-10 flex items-center justify-center rounded-full bg-slate text-white hover:opacity-90 transition-opacity"
          aria-label="سبد خرید"
        >
          <AppIcon icon="mdi:cart-outline" class="w-5 h-5" />
          <span
            v-if="cart.cartCount"
            class="absolute -bottom-0.5 -left-0.5 bg-lime text-slate text-[10px] font-bold min-w-[18px] h-[18px] flex items-center justify-center rounded-full px-1"
          >
            {{ cart.cartCount }}
          </span>
        </NuxtLink>

        <NuxtLink
          to="/login"
          class="flex items-center gap-2 px-4 py-2 rounded-full border border-slate/15 bg-slate text-white text-sm font-bold hover:opacity-90 transition-colors"
        >
          <AppIcon icon="mdi:account-outline" class="w-5 h-5" />
          <span>ورود </span>
        </NuxtLink>
      </div>
    </div>

    <!-- mobile drawer -->
    <Teleport to="body">
      <div
        v-if="ui.isMobileMenuOpen"
        class="fixed inset-0 z-[60] md:hidden"
        role="dialog"
        aria-modal="true"
        aria-label="منوی موبایل"
      >
        <div
          class="absolute inset-0 bg-slate/30 backdrop-blur-sm"
          aria-hidden="true"
          @click="ui.closeMobileMenu()"
        />
        <aside
          class="mobile-drawer fixed inset-y-0 right-0 z-[61] w-72 max-w-[85vw] shrink-0 bg-white border-l border-slate/10 p-6 pt-[4.75rem] flex flex-col gap-6 shadow-card overflow-y-auto"
        >
          <nav class="flex flex-col gap-1">
            <NuxtLink
              v-for="item in mobileNav"
              :key="item.to"
              :to="item.to"
              :class="navLinkClass(item.to, true, true)"
              @click="ui.closeMobileMenu()"
            >
              {{ item.label }}
            </NuxtLink>
          </nav>

          <div class="flex flex-col gap-2">
            <button type="button" @click="isCategoryOpen = !isCategoryOpen" class="flex items-center justify-between w-full px-4 py-3 rounded-xl text-sm font-bold text-slate/70 hover:bg-cream transition-colors" >
                <span>دسته‌بندی‌ها</span>
                  <AppIcon
                    :icon="isCategoryOpen ? 'mdi:chevron-up' : 'mdi:chevron-down'"
                    class="w-5 h-5 text-slate/45"
                  />
            </button>

            <div v-show="isCategoryOpen" class="flex flex-col gap-1">
               <NuxtLink
              v-for="cat in categoryStore.categories"
              :key="cat.slug"
              :to="`/category/${cat.slug}`"
              class="block px-4 py-2.5 rounded-xl text-sm font-semibold text-slate/70 hover:bg-cream hover:text-slate transition-colors"
              @click="ui.closeMobileMenu()"
            >
              {{ cat.name }}
              <span class="text-slate/40 text-xs">({{ cat.items }})</span>
            </NuxtLink>
            </div>
           
          </div>

          <div class="flex items-center gap-3 pt-4 mt-auto border-t border-slate/10">
            <NuxtLink
              to="/cart"
              class="relative w-10 h-10 flex items-center justify-center rounded-full bg-slate text-white shrink-0"
              @click="ui.closeMobileMenu()"
            >
              <AppIcon icon="mdi:cart-outline" class="w-5 h-5" />
              <span
                v-if="cart.cartCount"
                class="absolute -bottom-0.5 -left-0.5 bg-lime text-slate text-[10px] font-bold min-w-[18px] h-[18px] flex items-center justify-center rounded-full"
              >
                {{ cart.cartCount }}
              </span>
            </NuxtLink>
            <NuxtLink
              to="/login"
              class="flex-1 text-center py-2.5 rounded-full bg-slate text-white text-sm font-bold"
              @click="ui.closeMobileMenu()"
            >
              ورود | ثبت‌نام
            </NuxtLink>
          </div>
        </aside>
      </div>
    </Teleport>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useCategoryStore } from '../stores/categories'
import { useCartStore } from '../stores/cart'
import { useProductStore } from '../stores/productStore'
import { useUIStore } from '../stores/ui'
import { productPath } from '../utils/slugify'
import type { Product } from '~/types/types'

const ui = useUIStore()
const cart = useCartStore()
const store = useProductStore()
const router = useRouter()
const route = useRoute()
const categoryStore = useCategoryStore()
const isCategoryOpen = ref(false)

const searchQuery = ref('')
const isMobileSearchOpen = ref(false)
const typing = ref(false)

const mobileNav = [
  { label: 'خانه', to: '/' },
  { label: 'تازه‌ها', to: '/new' },
  { label: 'پرفروش‌ها', to: '/bestseller' },
  { label: 'پیشنهاد روز', to: '/daily-offers' },
  { label: 'درباره ما', to: '/about' },
]

let timer: ReturnType<typeof setTimeout> | null = null

// 70% scaffold — TODO 10%: isNavActive(path) بنویس و navLinkClass را ساده کن


function isNavActive(path: string, exact = true): boolean {
  return exact ? route.path === path : route.path.startsWith(path)

}

function navLinkClass(path: string, exact = true, block = false) {
  const base = block
    ? 'block px-4 py-3 rounded-xl text-sm font-bold transition-colors'
    : 'px-4 py-2 rounded-full text-sm font-bold transition-colors'
  return isNavActive(path,exact)
    ? `${base} bg-slate text-white`
    : `${base} text-slate/60 hover:text-slate hover:bg-cream`
}

function handleInput() {
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

function clearSearch() {
  searchQuery.value = ''
  store.products = []
}

function goToProduct(product: Product) {
  clearSearch()
  router.push(productPath(product))
}

function formatPrice(price: number) {
  return new Intl.NumberFormat('fa-IR').format(price) + ' تومان'
}

const isDropdownVisible = computed(
  () => searchQuery.value.trim() && store.products.length
)

function closeDropdown() {
  store.products = []
}

function closeOnDesktop() {
  if (window.innerWidth >= 768) ui.closeMobileMenu()
}

onMounted(() => {
  categoryStore.fetchCategories()
  window.addEventListener('resize', closeOnDesktop)
})

onUnmounted(() => {
  window.removeEventListener('resize', closeOnDesktop)
})

watch(
  () => ui.isMobileMenuOpen,
  (open) => {if (!open) isCategoryOpen.value = false},
 
)

watch(
  () => route.path,
  () =>{
    isCategoryOpen.value = false
    ui.closeMobileMenu()
  }
)
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

@keyframes drawer-in {
  from {
    transform: translate3d(100%, 0, 0);
  }
  to {
    transform: translate3d(0, 0, 0);
  }
}

.mobile-drawer {
  animation: drawer-in 0.28s ease-out;
}
</style>
