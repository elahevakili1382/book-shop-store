<template>
  <header
    class="header-root fixed inset-x-0 top-0 border-b transition-[transform,background-color,box-shadow,border-color] duration-300"
    :class="[headerClass, ui.isMobileMenuOpen ? 'z-[110]' : 'z-50']"
  >
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
              <ClientOnly>
                <NuxtLink
                  v-for="cat in categoryStore.categories"
                  :key="cat.slug"
                  :to="`/category/${cat.slug}`"
                  class="block px-4 py-2.5 text-sm text-slate/70 hover:bg-cream hover:text-slate transition-colors"
                >
                  {{ cat.name }}
                  <span class="text-slate/40 text-xs">({{ cat.items }})</span>
                </NuxtLink>
              </ClientOnly>
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
          class="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate/40"
        />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="جستجو..."
          class="w-full rounded-2xl py-2.5 pr-10 pl-3 text-right text-sm bg-cream/80 border border-slate/10 focus:outline-none focus:ring-1 focus:ring-slate/20"
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
            v-if="showSearchResults"
            class="absolute top-full left-0 right-0 mt-2 bg-white shadow-card rounded-2xl z-10 max-h-80 overflow-y-auto border border-slate/10"
          >
            <ul role="listbox">
              <li v-if="searchLoading" class="px-4 py-3 text-slate/50 text-center text-sm">در حال جستجو...</li>
              <li v-else-if="searchError" class="px-4 py-3 text-red-500 text-center text-sm">{{ searchError }}</li>
              <li
                v-else-if="!searchHits.length"
                class="px-4 py-3 text-slate/50 text-center text-sm"
              >
                کتابی پیدا نشد
              </li>
              <li v-for="p in searchHits" v-else :key="p._id">
                <button
                  type="button"
                  class="flex w-full items-center gap-3 px-4 py-3 text-right hover:bg-cream transition-colors"
                  @click="goToProduct(p)"
                >
                  <img
                    :src="p.image || '/images/default-book.jpg'"
                    :alt="p.title"
                    width="40"
                    height="56"
                    class="h-14 w-10 shrink-0 rounded-lg object-cover"
                  />
                  <span class="min-w-0 flex-1">
                    <span class="block truncate text-sm font-semibold text-slate">{{ p.title }}</span>
                    <span class="block truncate text-xs text-slate/50">{{ displayCategory(p.category) }}</span>
                  </span>
                  <span class="shrink-0 text-xs font-bold text-slate">{{ formatPrice(p.price) }}</span>
                </button>
              </li>
            </ul>
          </div>
        </transition>
      </div>

      <!-- mobile: چپ صفحه — جستجو + منو -->
      <div class="relative flex md:hidden items-center gap-0.5 shrink-0">
        <button
          type="button"
          class="p-2 rounded-full text-slate hover:bg-cream"
          :class="isMobileSearchOpen ? 'bg-cream' : ''"
          aria-label="جستجو"
          aria-controls="mobile-search"
          :aria-expanded="isMobileSearchOpen"
          @click="toggleMobileSearch"
        >
          <AppIcon icon="mdi:magnify" class="w-5 h-5" />
        </button>
        <button
          type="button"
          class="relative z-[111] p-2 rounded-full text-slate hover:bg-cream"
          :aria-label="ui.isMobileMenuOpen ? 'بستن منو' : 'منو'"
          :aria-expanded="ui.isMobileMenuOpen"
          aria-controls="mobile-menu"
          @click.stop.prevent="onMenuButtonClick"
        >
          <AppIcon :icon="ui.isMobileMenuOpen ? 'mdi:close' : 'mdi:menu'" class="w-6 h-6" />
        </button>

        <transition name="fade">
          <div
            v-if="isMobileSearchOpen"
            id="mobile-search"
            class="fixed inset-x-0 top-[4.25rem] z-[60] px-3 pt-2"
            click-outside="closeMobileSearch"
          >
            <div class="overflow-hidden rounded-2xl border border-slate/10 bg-white shadow-card">
              <div class="flex items-center gap-2 border-b border-slate/10 px-3">
                <AppIcon icon="mdi:magnify" class="h-5 w-5 shrink-0 text-slate/40" />
                <input
                  ref="mobileSearchInput"
                  v-model="searchQuery"
                  type="search"
                  role="combobox"
                  aria-autocomplete="list"
                  aria-controls="mobile-search-results"
                  :aria-expanded="showSearchResults"
                  placeholder="نام کتاب، نویسنده یا موضوع"
                  class="h-12 w-full bg-transparent text-right text-sm font-medium text-slate outline-none placeholder:text-slate/35"
                  @input="handleInput"
                />
                <button
                  v-if="searchQuery"
                  type="button"
                  class="shrink-0 rounded-full p-1 text-slate/45 hover:text-slate"
                  aria-label="پاک کردن جستجو"
                  @click="clearSearch"
                >
                  <AppIcon icon="mdi:close" class="h-4 w-4" />
                </button>
              </div>

              <ul
                v-if="showSearchResults"
                id="mobile-search-results"
                role="listbox"
                class="max-h-72 overflow-y-auto"
              >
                <li v-if="searchLoading" class="px-4 py-3 text-center text-sm text-slate/50">در حال جستجو...</li>
                <li v-else-if="searchError" class="px-4 py-3 text-center text-sm text-red-500">{{ searchError }}</li>
                <li v-else-if="!searchHits.length" class="px-4 py-3 text-center text-sm text-slate/50">کتابی پیدا نشد</li>
                <li v-for="p in searchHits" v-else :key="p._id">
                  <button
                    type="button"
                    role="option"
                    class="flex w-full items-center gap-3 px-3 py-2.5 text-right transition-colors hover:bg-cream"
                    @click="goToProduct(p)"
                  >
                    <img
                      :src="p.image || '/images/default-book.jpg'"
                      :alt="p.title"
                      width="40"
                      height="56"
                      class="h-14 w-10 shrink-0 rounded-lg object-cover"
                    />
                    <span class="min-w-0 flex-1">
                      <span class="block truncate text-sm font-bold text-slate">{{ p.title }}</span>
                      <span class="mt-0.5 block truncate text-xs text-slate/50">{{ displayCategory(p.category) }}</span>
                    </span>
                    <span class="shrink-0 text-xs font-bold text-slate">{{ formatPrice(p.price) }}</span>
                  </button>
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
          :to="accountTo"
          class="relative w-10 h-10 flex items-center justify-center rounded-full border border-slate/15 bg-white text-slate hover:bg-cream transition-colors"
          aria-label="پنل کاربری"
        >
          <AppIcon icon="mdi:account-outline" class="w-5 h-5" />
        </NuxtLink>
        <NuxtLink
          v-if="isAdmin"
          to="/dashboard"
          class="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold border border-slate/15 bg-slate text-white hover:opacity-90 transition-colors"
        >
          داشبورد
        </NuxtLink>
      </div>
    </div>

    <Teleport to="body">
      <Transition name="mobile-drawer">
        <div
          v-if="ui.isMobileMenuOpen"
          id="mobile-menu"
          class="fixed inset-0 z-[100]"
          role="dialog"
          aria-modal="true"
          aria-label="منوی موبایل"
        >
          <button
            type="button"
            class="absolute inset-0 bg-slate/25"
            aria-label="بستن منو"
            @click="onOverlayClick"
          />
          <aside
            class="mobile-drawer pointer-events-auto absolute inset-y-0 right-0 z-[101] flex w-[min(18.5rem,88vw)] flex-col gap-6 overflow-y-auto border-l border-white/50 p-6 pt-[4.75rem] text-slate shadow-[0_8px_32px_rgba(67,80,88,0.12)]"
            @click.stop
          >
          <nav class="flex flex-col gap-1">
            <NuxtLink
              to="/"
              :class="navLinkClass('/', true, true)"
              @click="ui.closeMobileMenu()"
            >
              <AppIcon icon="mdi:home-outline" class="h-5 w-5 shrink-0" />
              خانه
            </NuxtLink>

            <button
              type="button"
              class="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-slate/70 transition-colors hover:bg-cream"
              @click="isCategoryOpen = !isCategoryOpen"
            >
              <AppIcon icon="mdi:shape-outline" class="h-5 w-5 shrink-0" />
              <span class="flex-1 text-right">دسته‌بندی‌ها</span>
              <AppIcon
                :icon="isCategoryOpen ? 'mdi:chevron-up' : 'mdi:chevron-down'"
                class="h-5 w-5 text-slate/45"
              />
            </button>
            <div v-show="isCategoryOpen" class="flex flex-col gap-1 pb-1">
              <NuxtLink
                v-for="cat in categoryStore.categories"
                :key="cat.slug"
                :to="`/category/${cat.slug}`"
                class="flex items-center gap-3 rounded-xl px-4 py-2.5 pr-8 text-sm font-semibold text-slate/70 transition-colors hover:bg-cream hover:text-slate"
                @click="ui.closeMobileMenu()"
              >
                <AppIcon icon="mdi:book-outline" class="h-4 w-4 shrink-0 text-slate/40" />
                <span class="min-w-0 truncate">{{ cat.name }}</span>
                <span class="text-xs text-slate/40">({{ cat.items }})</span>
              </NuxtLink>
            </div>

            <NuxtLink
              v-for="item in mobileNav"
              :key="item.to"
              :to="item.to"
              :class="navLinkClass(item.to, true, true)"
              @click="ui.closeMobileMenu()"
            >
              <AppIcon :icon="item.icon" class="h-5 w-5 shrink-0" />
              {{ item.label }}
            </NuxtLink>
          </nav>

          <div class="mt-auto flex items-center gap-3 border-t border-slate/10 pt-4">
            <NuxtLink
              to="/cart"
              class="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate text-white"
              aria-label="سبد خرید"
              @click="ui.closeMobileMenu()"
            >
              <AppIcon icon="mdi:cart-outline" class="h-5 w-5" />
              <span
                v-if="cart.cartCount"
                class="absolute -bottom-0.5 -left-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-lime px-1 text-[10px] font-bold text-slate"
              >
                {{ cart.cartCount }}
              </span>
            </NuxtLink>
            <NuxtLink
              :to="accountTo"
              class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-slate/15 bg-white text-slate"
              aria-label="پنل کاربری"
              @click="ui.closeMobileMenu()"
            >
              <AppIcon icon="mdi:account-outline" class="h-5 w-5" />
            </NuxtLink>
            <NuxtLink
              :to="dashboardTo"
              class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-lime text-slate"
              aria-label="داشبورد"
              @click="ui.closeMobileMenu()"
            >
              <AppIcon icon="mdi:view-dashboard-outline" class="h-5 w-5" />
            </NuxtLink>
          </div>
          </aside>
        </div>
      </Transition>
    </Teleport>
  </header>
  <div class="h-[4.25rem]" aria-hidden="true" />
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useCategoryStore } from '../stores/categories'
import { useCartStore } from '../stores/cart'
import { useUIStore } from '../stores/ui'
import { productPath } from '../utils/slugify'
import { categoryLabel, categorySearchText } from '../utils/categoryLabel'
import type { Product } from '~/types/types'

const ui = useUIStore()
const cart = useCartStore()
const auth = useAuthStore()
const router = useRouter()
const route = useRoute()
const categoryStore = useCategoryStore()
const isCategoryOpen = ref(false)
const overlayReady = ref(false)
let overlayTimer: ReturnType<typeof setTimeout> | null = null
const isAdmin = computed(() => {
  const role = auth.user?.role
  return role === 'admin' || role === 'super-admin'
})

const accountTo = computed(() =>
  auth.isAuthenticated ? '/account' : '/login?redirect=/account',
)

const dashboardTo = computed(() => (isAdmin.value ? '/dashboard' : '/login#demo'))

const searchQuery = ref('')
const searchHits = ref<Product[]>([])
const searchCatalog = ref<Product[]>([])
const searchLoading = ref(false)
const searchError = ref('')
const isMobileSearchOpen = ref(false)
const mobileSearchInput = ref<HTMLInputElement | null>(null)
let searchSeq = 0
let catalogPromise: Promise<void> | null = null
const headerHidden = ref(false)
const headerSolid = ref(false)

const headerClass = computed(() => {
  const hidden = headerHidden.value && !ui.isMobileMenuOpen ? '-translate-y-full' : 'translate-y-0'
  const look = headerSolid.value
    ? 'border-solid border-slate/10 bg-cream shadow-card'
    : 'border-dashed border-slate/10 bg-cream'
  return `${hidden} ${look}`
})

const mobileNav = [
  { label: 'تازه‌ها', to: '/new', icon: 'mdi:new-box' },
  { label: 'پرفروش‌ها', to: '/bestseller', icon: 'mdi:fire' },
  { label: 'پیشنهاد روز', to: '/daily-offers', icon: 'mdi:brightness-percent' },
  { label: 'علاقه‌مندی‌ها', to: '/wishlist', icon: 'mdi:heart-outline' },
  { label: 'درباره ما', to: '/about', icon: 'mdi:information-outline' },
]

// 70% scaffold — TODO 10%: isNavActive(path) بنویس و navLinkClass را ساده کن


function isNavActive(path: string, exact = true): boolean {
  return exact ? route.path === path : route.path.startsWith(path)

}

function navLinkClass(path: string, exact = true, block = false) {
  const base = block
    ? 'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-colors'
    : 'px-4 py-2 rounded-full text-sm font-bold transition-colors'
  return isNavActive(path, exact)
    ? `${base} bg-slate text-white`
    : `${base} text-slate/60 hover:text-slate hover:bg-cream`
}

const showSearchResults = computed(() => searchQuery.value.trim().length > 0)

function displayCategory(slug?: string) {
  if (!slug) return ''
  return categoryStore.categories.find((cat) => cat.slug === slug)?.name || categoryLabel(slug)
}

function bookMatches(book: Product, query: string) {
  const q = query.toLowerCase()
  return [book.title, book.titleEn, book.author, displayCategory(book.category), categorySearchText(book.category)]
    .filter(Boolean)
    .some((field) => String(field).toLowerCase().includes(q))
}

function applyFilter(query: string) {
  searchHits.value = searchCatalog.value.filter((book) => bookMatches(book, query)).slice(0, 6)
}

function ensureCatalog() {
  if (searchCatalog.value.length) return Promise.resolve()
  if (catalogPromise) return catalogPromise
  catalogPromise = $fetch<Product[]>('/api/books', { query: { catalog: '1', limit: 200 } })
    .then((data) => {
      searchCatalog.value = Array.isArray(data) ? data : []
    })
    .catch(() => {
      catalogPromise = null
      searchError.value = 'جستجو انجام نشد'
    })
  return catalogPromise
}

function handleInput() {
  const query = searchQuery.value.trim()
  searchError.value = ''
  if (!query) {
    searchSeq += 1
    searchHits.value = []
    searchLoading.value = false
    return
  }

  if (searchCatalog.value.length) {
    searchLoading.value = false
    applyFilter(query)
    return
  }

  searchLoading.value = true
  const seq = ++searchSeq
  void ensureCatalog()?.then(() => {
    if (seq !== searchSeq || searchQuery.value.trim() !== query) return
    applyFilter(query)
    searchLoading.value = false
  })
}

function clearSearch() {
  searchSeq += 1
  searchQuery.value = ''
  searchHits.value = []
  searchLoading.value = false
  searchError.value = ''
}

function closeMobileSearch() {
  isMobileSearchOpen.value = false
  clearSearch()
}

function toggleMobileSearch() {
  if (isMobileSearchOpen.value) {
    closeMobileSearch()
    return
  }
  ui.closeMobileMenu()
  void ensureCatalog()
  isMobileSearchOpen.value = true
}

function goToProduct(product: Product) {
  const path = productPath(product)
  closeMobileSearch()
  router.push(path)
}

function formatPrice(price: number) {
  return new Intl.NumberFormat('fa-IR').format(price) + ' تومان'
}

function closeDropdown() {
  if (window.innerWidth < 768) return
  searchHits.value = []
  searchLoading.value = false
  searchError.value = ''
}

function closeOnDesktop() {
  if (window.innerWidth >= 768) ui.closeMobileMenu()
}

function onMenuButtonClick() {
  closeMobileSearch()
  overlayReady.value = false
  ui.toggleMobileMenu()
}

function onOverlayClick() {
  if (!overlayReady.value) return
  ui.closeMobileMenu()
}

let lastScrollY = 0

function onScroll() {
  const y = window.scrollY
  headerSolid.value = y > 8
  if (ui.isMobileMenuOpen || isMobileSearchOpen.value || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    headerHidden.value = false
    lastScrollY = y
    return
  }
  if (y < 56) {
    headerHidden.value = false
  } else if (y > lastScrollY + 8) {
    headerHidden.value = true
  } else if (y < lastScrollY - 8) {
    headerHidden.value = false
  }
  lastScrollY = y
}

onMounted(() => {
  categoryStore.fetchCategories()
  void ensureCatalog()
  window.addEventListener('resize', closeOnDesktop)
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})

onUnmounted(() => {
  window.removeEventListener('resize', closeOnDesktop)
  window.removeEventListener('scroll', onScroll)
  if (overlayTimer) clearTimeout(overlayTimer)
  ui.closeMobileMenu()
})

watch(
  () => ui.isMobileMenuOpen,
  async (open) => {
    if (!open) {
      isCategoryOpen.value = false
      overlayReady.value = false
      if (overlayTimer) {
        clearTimeout(overlayTimer)
        overlayTimer = null
      }
      return
    }
    overlayReady.value = false
    await nextTick()
    overlayTimer = setTimeout(() => {
      overlayReady.value = true
    }, 280)
  },
)

watch(
  () => route.path,
  () => {
    isCategoryOpen.value = false
    ui.closeMobileMenu()
    closeMobileSearch()
  },
)

watch(isMobileSearchOpen, async (open) => {
  if (!open) return
  await nextTick()
  mobileSearchInput.value?.focus()
})
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

.mobile-drawer-enter-active,
.mobile-drawer-leave-active {
  transition: opacity 0.2s ease;
}
.mobile-drawer-enter-active .mobile-drawer,
.mobile-drawer-leave-active .mobile-drawer {
  transition: transform 0.28s ease-out;
}
.mobile-drawer-enter-from,
.mobile-drawer-leave-to {
  opacity: 1;
}
.mobile-drawer-enter-from .mobile-drawer,
.mobile-drawer-leave-to .mobile-drawer {
  transform: translate3d(100%, 0, 0);
}

.mobile-drawer {
  background: rgba(255, 255, 255, 0.42);
  backdrop-filter: blur(24px) saturate(1.4);
  -webkit-backdrop-filter: blur(24px) saturate(1.4);
}

html.shot .mobile-drawer,
html.shot .mobile-drawer-enter-from .mobile-drawer,
html.shot .mobile-drawer-leave-to .mobile-drawer {
  animation: none !important;
  transform: none !important;
}

@media (prefers-reduced-motion: reduce) {
  .header-root {
    transition: none;
  }
}
</style>
