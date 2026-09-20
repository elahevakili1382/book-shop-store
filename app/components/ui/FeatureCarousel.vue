<template>
  <section class="why-us overflow-hidden rounded-[1.75rem] border border-slate/10 sm:rounded-[2rem]">
    <div class="grid lg:grid-cols-2 lg:items-stretch">
      <div class="flex h-full flex-col justify-center bg-slate px-6 py-8 text-white sm:px-8 sm:py-10 lg:min-h-[36rem] lg:px-10 lg:py-12">
        <p class="text-xs font-bold text-lime">چرا Booklett</p>
        <h2 class="mt-2 text-2xl font-black leading-snug sm:text-3xl">خرید کتاب، بدون حاشیه</h2>
        <p class="mt-3 max-w-lg text-sm leading-relaxed text-white/60">
          ارسال سریع، نسخه اصل و قیمت همان روی جلد — این‌ها ثابت‌اند. کنارش فقط جلد کتاب‌ها ورق می‌خورد.
        </p>

        <ul class="mt-7 grid grid-cols-2 gap-2">
          <li
            v-for="feature in features"
            :key="feature.id"
            class="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3.5 py-3"
          >
            <span class="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-lime/15 text-lime">
              <component :is="feature.icon" class="h-4 w-4" />
            </span>
            <div class="min-w-0 text-right">
              <p class="text-sm font-bold">{{ feature.label }}</p>
              <p class="mt-0.5 hidden text-[11px] text-white/50 sm:block sm:line-clamp-1">{{ feature.description }}</p>
            </div>
          </li>
        </ul>
      </div>

      <div
        class="relative flex min-h-[28rem] items-center justify-center overflow-hidden bg-cream px-4 py-10 sm:min-h-[32rem] lg:min-h-[36rem] lg:px-8"
        @mouseenter="isPaused = true"
        @mouseleave="isPaused = false"
        @pointerdown="onPointerDown"
        @pointerup="onPointerUp"
      >
        <p v-if="!books.length" class="text-sm text-slate/45">در حال بارگذاری...</p>

        <ClientOnly v-else>
          <div class="relative mx-auto aspect-[3/4] w-full max-w-[17.5rem] sm:max-w-[20rem] lg:max-w-[21rem]">
            <motion.div
              v-for="(book, index) in books"
              :key="book.id"
              :initial="false"
              :animate="cardAnimate(index)"
              :transition="cardTransition"
              class="absolute inset-0 origin-center overflow-hidden rounded-[1.6rem] border-4 border-cream bg-white sm:rounded-[2rem] sm:border-[6px]"
              :class="cardClass(index)"
              @click="onCardClick(index, $event)"
            >
              <NuxtLink
                v-if="getCardStatus(index) === 'active'"
                :to="productPath(book)"
                class="block h-full w-full"
              >
                <img
                  :src="book.image"
                  :alt="book.title"
                  width="320"
                  height="430"
                  draggable="false"
                  class="h-full w-full object-cover"
                />
              </NuxtLink>
              <img
                v-else
                :src="book.image"
                :alt="book.title"
                width="320"
                height="430"
                draggable="false"
                class="h-full w-full object-cover grayscale brightness-75"
              />

              <AnimatePresence>
                <motion.div
                  v-if="getCardStatus(index) === 'active'"
                  :key="`caption-${book.id}`"
                  :initial="{ opacity: 0, y: 16 }"
                  :animate="{ opacity: 1, y: 0 }"
                  :exit="{ opacity: 0, y: 8 }"
                  class="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate/90 via-slate/35 to-transparent px-5 pb-5 pt-16"
                >
                  <p class="text-sm font-bold text-white sm:text-base">{{ book.title }}</p>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </div>
        </ClientOnly>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { AnimatePresence, motion } from 'motion-v'
import {
  Truck,
  ShieldCheck,
  BadgeDollarSign,
  CreditCard,
  Headphones,
  BookOpen,
  Star,
  Sparkles,
} from 'lucide-vue-next'
import { productPath } from '../../utils/slugify'
import type { Product } from '../../../types/types'

const AUTO_PLAY_INTERVAL = 3000

const features = [
  { id: 'shipping', label: 'ارسال سریع', description: 'تحویل به سراسر کشور.', icon: Truck },
  { id: 'original', label: 'کتاب اصل', description: 'نسخه اصلی با گارانتی.', icon: ShieldCheck },
  { id: 'price', label: 'قیمت شفاف', description: 'همان مبلغ روی جلد.', icon: BadgeDollarSign },
  { id: 'pay', label: 'پرداخت امن', description: 'آنلاین یا در محل.', icon: CreditCard },
  { id: 'support', label: 'پشتیبانی', description: 'تا رسیدن کتاب همراه‌تیم.', icon: Headphones },
  { id: 'select', label: 'انتخاب دقیق', description: 'رمان، دانش و برنامه‌نویسی.', icon: BookOpen },
  { id: 'rated', label: 'پرفروش‌ها', description: 'انتخاب خواننده‌ها.', icon: Star },
  { id: 'new', label: 'تازه‌ها', description: 'هر هفته عنوان جدید.', icon: Sparkles },
]

type CarouselBook = { id: string; title: string; titleEn?: string; image: string; slug?: string }
type CardStatus = 'active' | 'prev' | 'next' | 'hidden'

const books = ref<CarouselBook[]>([])
const currentIndex = ref(0)
const isPaused = ref(false)
const reduceMotion = ref(false)
let pointerStartX = 0

const cardTransition = computed(() =>
  reduceMotion.value
    ? { duration: 0.01 }
    : { type: 'spring', stiffness: 260, damping: 25, mass: 0.8 }
)

function getCardStatus(index: number): CardStatus {
  const len = books.value.length
  if (!len) return 'hidden'
  let diff = index - currentIndex.value
  if (diff > len / 2) diff -= len
  if (diff < -len / 2) diff += len
  if (diff === 0) return 'active'
  if (diff === -1) return 'prev'
  if (diff === 1) return 'next'
  return 'hidden'
}

function cardAnimate(index: number) {
  const status = getCardStatus(index)
  const isActive = status === 'active'
  const isPrev = status === 'prev'
  const isNext = status === 'next'
  return {
    x: isActive ? 0 : isPrev ? -100 : isNext ? 100 : 0,
    scale: isActive ? 1 : isPrev || isNext ? 0.85 : 0.7,
    opacity: isActive ? 1 : isPrev || isNext ? 0.4 : 0,
    rotate: isPrev ? -3 : isNext ? 3 : 0,
    zIndex: isActive ? 20 : isPrev || isNext ? 10 : 0,
  }
}

function cardClass(index: number) {
  const status = getCardStatus(index)
  if (status === 'hidden') return 'pointer-events-none'
  if (status === 'active') return 'z-20 cursor-pointer'
  return 'z-10 cursor-pointer'
}

function goTo(index: number) {
  const len = books.value.length
  if (!len) return
  currentIndex.value = ((index % len) + len) % len
}

function next() {
  goTo(currentIndex.value + 1)
}

function prev() {
  goTo(currentIndex.value - 1)
}

function onCardClick(index: number, event: MouseEvent) {
  if (getCardStatus(index) === 'active') return
  event.preventDefault()
  goTo(index)
}

function onPointerDown(event: PointerEvent) {
  pointerStartX = event.clientX
}

function onPointerUp(event: PointerEvent) {
  const dx = event.clientX - pointerStartX
  if (dx > 48) prev()
  else if (dx < -48) next()
}

function hasRealCover(image?: string) {
  if (!image) return false
  return !image.includes('NonFiction') && !image.includes('default-book')
}

let timer: ReturnType<typeof setInterval> | null = null

onMounted(async () => {
  reduceMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  try {
    const data = await $fetch<Product[]>('/api/books', { query: { limit: 24 } })
    const ranked = [...(data ?? [])].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
    const withCover = ranked.filter((b) => hasRealCover(b.image))
    books.value = (withCover.length ? withCover : ranked).slice(0, 8).map((b) => ({
      id: String(b.id ?? b._id),
      title: b.title,
      titleEn: b.titleEn,
      image: b.image,
      slug: b.slug,
    }))
  } catch {
    books.value = []
  }

  timer = setInterval(() => {
    if (!isPaused.value && books.value.length > 1) next()
  }, AUTO_PLAY_INTERVAL)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<style scoped>
.why-us {
  direction: rtl;
}
</style>
