<template>
  <section class="hero-root relative overflow-x-hidden">
    <div class="absolute inset-0 pointer-events-none overflow-hidden">
      <div class="absolute -top-40 -right-32 w-[520px] h-[520px] rounded-full bg-lime/15 blur-3xl" />
      <div class="absolute top-1/2 -left-48 w-[400px] h-[400px] rounded-full bg-slate/5 blur-3xl" />
    </div>

    <div class="relative z-10 max-w-[1280px] mx-auto px-4 sm:px-8 pt-6 pb-12 lg:pt-8 lg:pb-20">
      <!-- quick nav -->
      <nav class="flex flex-nowrap sm:flex-wrap items-center justify-center lg:justify-end gap-1 sm:gap-2 mb-6 sm:mb-8 lg:mb-10 overflow-x-auto scrollbar-hide pb-1">
        <NuxtLink
          v-for="link in quickLinks"
          :key="link.to"
          :to="link.to"
          class="px-4 py-2 text-xs sm:text-sm font-bold tracking-wide text-slate/55 hover:text-slate transition-colors rounded-full hover:bg-white/60"
        >
          {{ link.label }}
        </NuxtLink>
      </nav>

      <div class="grid lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-12 items-start lg:items-center">
        <!-- intro — موبایل: اول -->
        <div class="lg:col-span-5 order-1 lg:order-none space-y-4 sm:space-y-5 text-center lg:text-right">
          <ClientOnly>
            <motion.div
              :initial="{ opacity: 0, y: 16 }"
              :animate="{ opacity: 1, y: 0 }"
              :transition="{ duration: 0.45 }"
              class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 backdrop-blur border border-slate/10 text-sm font-medium text-slate"
            >
              <span class="w-1.5 h-1.5 rounded-full bg-slate/40" />
              {{ bookCount }}+ کتاب منتخب
            </motion.div>
          </ClientOnly>

          <h1 class="text-3xl sm:text-[2.75rem] lg:text-[3rem] font-black text-slate leading-[1.1] tracking-tight">
            <ClientOnly>
              <motion.span
                v-for="(line, i) in headlineLines"
                :key="line"
                :initial="{ opacity: 0, y: 24 }"
                :animate="{ opacity: 1, y: 0 }"
                :transition="{ duration: 0.55, delay: 0.08 + i * 0.1 }"
                :class="['block', i === 1 ? 'text-slate/65' : '']"
              >
                {{ line }}
              </motion.span>
              <template #fallback>
                <span v-for="line in headlineLines" :key="line" class="block">{{ line }}</span>
              </template>
            </ClientOnly>
          </h1>

          <p class="text-base text-slate/55 max-w-md mx-auto lg:mx-0 leading-relaxed">
            از رمان تا برنامه‌نویسی — کاور واقعی، قیمت شفاف، تحویل سریع.
          </p>

          <ClientOnly>
            <motion.form
              :initial="{ opacity: 0, y: 12 }"
              :animate="{ opacity: 1, y: 0 }"
              :transition="{ duration: 0.45, delay: 0.25 }"
              class="relative max-w-md mx-auto lg:mx-0"
              @submit.prevent="onSearch"
            >
              <AppIcon
                icon="mdi:magnify"
                class="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate/40"
              />
              <input
                v-model="searchQuery"
                type="text"
                placeholder="نام کتاب را جستجو کن..."
                class="w-full rounded-2xl py-3.5 pr-12 pl-4 bg-white border border-slate/10 focus:ring-1 focus:ring-slate/20 focus:outline-none text-right font-medium"
              />
            </motion.form>
          </ClientOnly>

          <div class="flex flex-wrap justify-center lg:justify-start gap-3">
            <button
              type="button"
              class="px-6 py-3 rounded-2xl bg-slate text-white font-bold text-sm shadow-card hover:opacity-90 transition-opacity flex items-center gap-2"
              @click="goShop"
            >
              <AppIcon icon="mdi:cart-outline" class="w-4 h-4" />
              شروع خرید
            </button>
            <button
              type="button"
              class="px-6 py-3 rounded-2xl bg-white border border-slate/15 text-slate font-bold text-sm hover:bg-cream transition-colors"
              @click="goExplore"
            >
              کاوش دسته‌ها
            </button>
          </div>

          <ClientOnly>
            <motion.div
              v-if="categories.length"
              :initial="{ opacity: 0, y: 10 }"
              :animate="{ opacity: 1, y: 0 }"
              :transition="{ duration: 0.45, delay: 0.35 }"
              class="flex flex-wrap justify-center lg:justify-start gap-2 pt-1"
            >
              <button
                v-for="cat in categories.slice(0, 6)"
                :key="cat.slug"
                type="button"
                :class="[
                  'px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-colors',
                  selectedSlug === cat.slug
                    ? 'bg-slate text-white border-slate'
                    : 'bg-white/70 border-slate/10 text-slate/70 hover:border-slate/25 hover:text-slate',
                ]"
                @click="goCategory(cat.slug)"
              >
                {{ cat.name }}
              </button>
            </motion.div>
          </ClientOnly>
        </div>

        <!-- carousel + read continue — موبایل: دوم -->
        <div class="lg:col-span-7 lg:-mt-2 order-2 lg:order-none w-full min-w-0">
          <ClientOnly>
            <div v-if="featuredBooks.length" class="flex flex-col sm:grid sm:grid-cols-12 gap-6 sm:gap-6 items-start">
              <div class="w-full sm:col-span-7">
                <motion.div
                  :initial="{ opacity: 0, y: 24 }"
                  :animate="{ opacity: 1, y: 0 }"
                  :transition="{ duration: 0.7, delay: 0.2, type: 'spring', stiffness: 80 }"
                >
                  <p class="text-xs font-bold tracking-[0.22em] text-slate/40 mb-3 text-center sm:text-right">
                    برای تو
                  </p>

                  <div class="flex items-center justify-center gap-1 sm:gap-2 overflow-visible">
                    <motion.button
                      type="button"
                      aria-label="کتاب قبلی"
                      :while-hover="{ scale: 1.06 }"
                      :while-tap="{ scale: 0.95 }"
                      class="hidden sm:flex shrink-0 w-10 h-10 rounded-full bg-white border border-slate/10 items-center justify-center text-slate hover:bg-cream self-center z-10"
                      @click="prevSlide"
                    >
                      <AppIcon icon="mdi:chevron-right" class="w-5 h-5" />
                    </motion.button>

                    <div class="relative w-full max-w-[260px] sm:max-w-[340px] h-[240px] sm:h-[360px] mx-auto shrink-0 overflow-visible">
                      <div
                        v-for="(book, i) in visibleSlides"
                        :key="book._id || book.id || `${book.title}-${i}`"
                        class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                        :style="{ zIndex: getSlideAnim(i).zIndex }"
                      >
                        <motion.div
                          :initial="false"
                          :animate="{
                            x: getSlideAnim(i).x,
                            y: getSlideAnim(i).y,
                            scale: getSlideAnim(i).scale,
                            rotate: getSlideAnim(i).rotate,
                            opacity: getSlideAnim(i).opacity,
                          }"
                          :transition="{ type: 'spring', stiffness: 260, damping: 28 }"
                          class="cursor-pointer origin-center"
                          @click="book && (i === 1 ? goProduct(book) : i === 0 ? prevSlide() : nextSlide())"
                        >
                          <div
                            :class="[
                              'relative rounded-3xl overflow-hidden bg-white border border-white/90',
                              i === 1
                                ? 'p-2.5 sm:p-3.5 w-[170px] sm:w-[230px] shadow-card ring-1 ring-slate/8'
                                : 'p-2 w-[110px] sm:w-[148px] shadow-card',
                            ]"
                          >
                            <button
                              v-if="i === 1"
                              type="button"
                              aria-label="نشان‌گذاری"
                              class="absolute top-3.5 left-3.5 z-10 w-7 h-7 rounded-full bg-white/95 border border-slate/10 flex items-center justify-center text-slate/50 hover:text-slate"
                              @click.stop
                            >
                              <AppIcon icon="mdi:bookmark-outline" class="w-3.5 h-3.5" />
                            </button>
                            <NuxtImg
                              :src="book.image"
                              :alt="book.title"
                              :width="i === 1 ? 230 : 160"
                              :height="i === 1 ? 320 : 220"
                              :class="[
                                'object-cover rounded-2xl w-full',
                                i === 1 ? 'h-[210px] sm:h-[290px]' : 'h-[150px] sm:h-[195px]',
                              ]"
                              format="webp"
                            />
                          </div>
                        </motion.div>
                      </div>
                    </div>

                    <motion.button
                      type="button"
                      aria-label="کتاب بعدی"
                      :while-hover="{ scale: 1.06 }"
                      :while-tap="{ scale: 0.95 }"
                      class="hidden sm:flex shrink-0 w-10 h-10 rounded-full bg-white border border-slate/10 items-center justify-center text-slate hover:bg-cream self-center z-10"
                      @click="nextSlide"
                    >
                      <AppIcon icon="mdi:chevron-left" class="w-5 h-5" />
                    </motion.button>
                  </div>

                  <!-- موبایل: دکمه prev/next (دسکتاپ: arrow کنار stack) -->
                  <div class="flex sm:hidden items-center justify-center gap-4 mt-2">
                    <button
                      type="button"
                      aria-label="کتاب قبلی"
                      class="w-10 h-10 rounded-full bg-white border border-slate/10 flex items-center justify-center text-slate active:bg-cream"
                      @click="prevSlide"
                    >
                      <AppIcon icon="mdi:chevron-right" class="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      aria-label="کتاب بعدی"
                      class="w-10 h-10 rounded-full bg-white border border-slate/10 flex items-center justify-center text-slate active:bg-cream"
                      @click="nextSlide"
                    >
                      <AppIcon icon="mdi:chevron-left" class="w-5 h-5" />
                    </button>
                  </div>

                  <!-- کتاب فعال — زیر carousel -->
                  <div v-if="currentBook" class="hero-book-meta mt-4 text-center sm:text-right px-1">
                    <p class="text-[11px] font-bold tracking-[0.18em] text-slate/40 mb-2">
                      پیشنهاد ویژه
                    </p>
                    <h2 class="hero-book-title text-xl sm:text-2xl font-bold text-slate leading-snug">
                      {{ currentBook.title }}
                    </h2>
                    <p v-if="currentBook.category" class="mt-1.5 text-sm text-slate/50">
                      {{ currentBook.category }}
                    </p>
                    <p class="mt-3 inline-block text-sm font-semibold text-slate/75 px-3 py-1 rounded-full bg-white/80 border border-slate/10">
                      {{ formatPrice(currentBook.price) }}
                    </p>
                  </div>

                  <!-- TODO 20%: اندازه slidePositionLabel یا استایل counter را خودت tune کن -->
                  <p class="mt-3 text-center sm:text-right text-xs font-semibold tracking-wide text-slate/55">
                    {{ slidePositionLabel }}
                  </p>
                </motion.div>
              </div>

              <div class="w-full sm:col-span-5">
                <motion.div
                  v-if="featuredBooks.length > 1"
                  :initial="{ opacity: 0, y: 20 }"
                  :animate="{ opacity: 1, y: 0 }"
                  :transition="{ duration: 0.55, delay: 0.45 }"
                  class="overflow-hidden"
                >
                  <p class="text-xs font-bold tracking-[0.15em] text-slate/45 mb-4 text-center sm:text-right">
                    ادامه مطالعه
                  </p>
                  <div class="flex flex-col gap-2.5">
                    <motion.button
                      v-for="(book, i) in readContinueBooks"
                      :key="book._id || book.id || book.title"
                      type="button"
                      :initial="{ opacity: 0, x: 12 }"
                      :animate="{ opacity: 1, x: 0 }"
                      :transition="{ duration: 0.35, delay: 0.5 + i * 0.05 }"
                      :class="[
                        'w-full flex items-center gap-3 rounded-2xl px-3 py-2.5 border transition-all text-right',
                        isCurrentBook(book)
                          ? 'bg-white border-slate/15 shadow-card'
                          : 'bg-white/60 border-slate/8 hover:border-slate/15',
                      ]"
                      @click="activeIndex = featuredBooks.indexOf(book)"
                    >
                      <NuxtImg
                        :src="book.image"
                        :alt="book.title"
                        width="40"
                        height="56"
                        class="rounded-lg object-cover h-14 w-10 shrink-0"
                        format="webp"
                      />
                      
                      <div class="flex-1 min-w-0">
                        <p class="text-xs font-bold text-slate truncate">{{ book.title }}</p>
                        <div class="mt-2 h-0.5 rounded-full bg-slate/10 overflow-hidden">
                          <div
                            class="h-full rounded-full bg-slate/30 transition-all duration-500"
                            :style="{ width: `${readProgress[i]}%` }"
                          />
                        </div>
                      </div>

                      <span class="text-[10px] font-semibold text-slate/45 shrink-0">
                        {{ readProgress[i] }}%
                      </span>
                    </motion.button>
                  </div>
                </motion.div>
              </div>
            </div>

            <template #fallback>
              <div class="flex justify-center py-16">
                <NuxtImg
                  src="/images/books/atomic-habits.jpg"
                  width="180"
                  class="rounded-2xl shadow-card"
                />
              </div>
            </template>
          </ClientOnly>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { motion } from 'motion-v'
import { useCategoryStore } from '../stores/categories'

type HeroBook = {
  _id?: string
  id?: string
  title: string
  image: string
  price: number
  category?: string
}

const router = useRouter()
const searchQuery = ref('')
const activeIndex = ref(0)
const selectedSlug = ref('')
const categoryStore = useCategoryStore()
const featuredBooks = ref<HeroBook[]>([])
const headlineLines = ['کتاب بعدی‌ات', 'یک کلیک فاصله دارد']
const readProgress = [25, 50, 75, 40]

const quickLinks = [
  { label: 'کتاب‌های من', to: '/new' },
  { label: 'مرور', to: '/new' },
  { label: 'پرفروش‌ها', to: '/bestseller' },
  { label: 'پیشنهاد روز', to: '/daily-offers' },
]

const categories = computed(() => categoryStore.categories)
const bookCount = computed(() => featuredBooks.value.length || 20)
const currentBook = computed(() => featuredBooks.value[activeIndex.value])
const readContinueBooks = computed(() => featuredBooks.value.slice(0, 4))

const slidePositionLabel = computed(
  () => `${activeIndex.value + 1} / ${featuredBooks.value.length}`
)


function isCurrentBook(book:HeroBook){
  return book === currentBook.value
}

const visibleSlides = computed((): HeroBook[] => {
  const list = featuredBooks.value
  if (!list.length) return []

  const len = list.length
  return [
    list[(activeIndex.value - 1 + len) % len]!,
    list[activeIndex.value]!,
    list[(activeIndex.value + 1) % len]!,
  ]
})

type SlideAnim = {
  x: number
  y: number
  scale: number
  rotate: number
  zIndex: number
  opacity: number
}

const SLIDE_ANIMS: Record<number, SlideAnim> = {
  0: { x: -64, y: 14, scale: 0.92, rotate: -12, zIndex: 10, opacity: 0.88 },
  1: { x: 0, y: 0, scale: 1, rotate: 0, zIndex: 30, opacity: 1 },
  2: { x: 64, y: 14, scale: 0.92, rotate: 12, zIndex: 10, opacity: 0.88 },
}

const SLIDE_ANIMS_MOBILE: Record<number, SlideAnim> = {
  0: { x: -32, y: 8, scale: 0.94, rotate: -5, zIndex: 10, opacity: 0.85 },
  1: { x: 0, y: 0, scale: 1, rotate: 0, zIndex: 30, opacity: 1 },
  2: { x: 32, y: 8, scale: 0.94, rotate: 5, zIndex: 10, opacity: 0.85 },
}

const isMobileView = ref(false)

function updateMobileView() {
  isMobileView.value = window.innerWidth < 640
}

const DEFAULT_SLIDE_ANIM: SlideAnim = {
  x: 0,
  y: 0,
  scale: 1,
  rotate: 0,
  zIndex: 30,
  opacity: 1,
}

function getSlideAnim(position: number): SlideAnim {
  const map = isMobileView.value ? SLIDE_ANIMS_MOBILE : SLIDE_ANIMS
  return map[position] ?? DEFAULT_SLIDE_ANIM
}

function formatPrice(price?: number) {
  if (!price) return ''
  return new Intl.NumberFormat('fa-IR').format(price) + ' تومان'
}

function slugify(title: string) {
  return title.toLowerCase().replace(/\s+/g, '-')
}

function prevSlide() {
  const len = featuredBooks.value.length
  if (!len) return
  activeIndex.value = (activeIndex.value - 1 + len) % len
}

function nextSlide() {
  const len = featuredBooks.value.length
  if (!len) return
  activeIndex.value = (activeIndex.value + 1) % len
}

function goShop() {
  router.push('/new')
}

function goExplore() {
  const first = categories.value[0]?.slug
  router.push(first ? `/category/${first}` : '/new')
}

function goCategory(slug: string) {
  selectedSlug.value = slug
  router.push(`/category/${slug}`)
}

function goProduct(book: { title: string }) {
  router.push(`/product/${slugify(book.title)}`)
}

function onSearch() {
  const q = searchQuery.value.trim()
  router.push(q ? { path: '/new', query: { q } } : '/new')
}

onMounted(async () => {
  updateMobileView()
  window.addEventListener('resize', updateMobileView)

  await categoryStore.fetchCategories()

  try {
    const data = await $fetch<
      Array<{ _id: string; id: string; title: string; image: string; price: number; category?: string }>
    >('/api/books')
    if (Array.isArray(data) && data.length) {
      featuredBooks.value = data.slice(0, 8)
    }
  } catch {
    featuredBooks.value = [
      { title: 'Atomic Habits', image: '/images/books/atomic-habits.jpg', price: 320000, category: 'خودیاری' },
      { title: 'Clean Code', image: '/images/books/clean-code.jpg', price: 250000, category: 'برنامه‌نویسی' },
      { title: 'Deep Work', image: '/images/books/deep-work.jpg', price: 210000, category: 'بهره‌وری' },
      { title: 'Sapiens', image: '/images/books/sapiens.jpg', price: 280000, category: 'تاریخ' },
    ]
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', updateMobileView)
})
</script>

<style scoped>
.hero-root {
  background: linear-gradient(165deg, #fafaf7 0%, #f6f5f1 50%, #f0efe9 100%);
  direction: rtl;
}

.hero-book-title {
  font-family: Georgia, 'Times New Roman', serif;
  letter-spacing: -0.02em;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
