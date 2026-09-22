<template>
  <section class="overflow-x-hidden">
    <SectionHeader
      eyebrow="پیشنهاد روز"
      title="پیشنهادهای ویژه"
      subtitle="تخفیف‌های محدود امروز"
      link-to="/daily-offers"
      link-label="همه پیشنهادها"
      :show-nav="!!products.length && !isLoading"
      :nav-ready="swiperReady"
      @prev="slidePrev"
      @next="slideNext"
    />

    <article class="deal-banner relative z-0 mb-8 mt-2 overflow-hidden rounded-[1.75rem] border border-slate bg-slate text-white sm:rounded-[2rem]">
      <span class="deal-percent" aria-hidden="true">۵۰٪</span>

      <div class="relative z-10 grid items-start gap-8 px-5 pb-8 pt-10 sm:px-8 sm:pb-10 sm:pt-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:items-center lg:gap-8 lg:px-12 lg:py-14">
        <div class="order-1 text-center lg:text-right">
          <p class="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-bold">
            <span class="h-1.5 w-1.5 rounded-full bg-lime" />
            تا پایان امروز
          </p>

          <h3 class="mt-5 text-balance text-[1.85rem] font-black leading-snug sm:text-4xl lg:text-[2.35rem]">
            تا
            <span class="text-lime">۵۰٪</span>
            تخفیف روی کتاب‌های منتخب
          </h3>
          <p class="mx-auto mt-3 max-w-md text-sm leading-relaxed text-white/65 sm:text-base lg:mx-0">
            جلد واقعی، قیمت نصف. کد را بگیر و قبل از تمام شدن روز خرید کن.
          </p>

          <div class="mt-6 flex justify-center gap-2 lg:justify-start" dir="ltr">
            <div v-for="unit in countdownUnits" :key="unit.label" class="min-w-[4.25rem] rounded-2xl bg-white/10 px-3 py-2 text-center">
              <p class="font-mono text-xl font-black tabular-nums text-lime sm:text-2xl">{{ unit.value }}</p>
              <p class="mt-0.5 text-[10px] font-bold text-white/50">{{ unit.label }}</p>
            </div>
          </div>

          <div class="mt-7 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
            <NuxtLink
              to="/daily-offers"
              class="inline-flex min-w-[148px] items-center justify-center rounded-2xl bg-lime px-6 py-3 text-sm font-bold text-slate hover:brightness-95"
            >
              خرید الان
            </NuxtLink>
            <button
              type="button"
              class="inline-flex min-w-[148px] items-center justify-center rounded-2xl border border-white/20 bg-transparent px-6 py-3 text-sm font-bold text-white hover:bg-white/10"
              @click="copyCoupon"
            >
              دریافت کوپن
            </button>
          </div>
          <p class="mt-3 text-xs text-white/40">کد تخفیف: {{ couponCode }}</p>
        </div>

        <div class="deal-covers order-2 flex items-end justify-center gap-3 pb-1 lg:justify-start lg:ps-4">
          <NuxtLink
            v-for="(book, index) in bannerCovers"
            :key="book.id"
            :to="productPath(book)"
            class="deal-cover"
            :style="{ animationDelay: `${index * 0.35}s`, zIndex: bannerCovers.length - index }"
          >
            <img
              :src="book.image"
              :alt="book.title"
              width="200"
              height="280"
              loading="lazy"
              decoding="async"
              class="h-40 w-[7.25rem] rounded-xl object-cover sm:h-48 sm:w-[8.75rem] lg:h-56 lg:w-[10.25rem]"
            />
          </NuxtLink>
        </div>
      </div>
    </article>

    <div v-if="isLoading" class="flex h-40 items-center justify-center rounded-3xl border border-slate/8 bg-white">
      <span class="text-slate/50">در حال بارگذاری...</span>
    </div>

    <ClientOnly v-else>
      <div v-if="products.length" class="overflow-x-hidden -mx-4 px-4">
        <Swiper
          grab-cursor
          class="peek-swiper"
          slides-per-view="auto"
          :space-between="12"
          @swiper="onSwiper"
          :breakpoints="{
            640: { slidesPerView: 1.35, spaceBetween: 14 },
            768: { slidesPerView: 2, spaceBetween: 16 },
            1024: { slidesPerView: 2.25, spaceBetween: 16 },
          }"
        >
          <SwiperSlide
            v-for="product in products"
            :key="product.id ?? product._id"
            class="peek-slide-deal h-auto"
          >
            <SoldProductCard :product="product" />
          </SwiperSlide>
        </Swiper>
      </div>
    </ClientOnly>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import type SwiperClass from 'swiper'
import SoldProductCard from './SoldProductCard.vue'
import SectionHeader from './ui/SectionHeader.vue'
import { mapBookToProduct } from '../stores/productStore'
import { productPath } from '../utils/slugify'
import 'swiper/css'

const couponCode = 'BOOK50'
const toast = useToast()

const { data: dealBooks, pending: isLoading } = await useAsyncData('deals-of-day-books', async () => {
  const data = await $fetch<Record<string, unknown>[]>('/api/books', { query: { limit: 16 } })
  const list = Array.isArray(data) ? data.map(mapBookToProduct) : []
  return [...list].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
})

const products = computed(() => dealBooks.value?.slice(0, 8) ?? [])
const bannerCovers = computed(() => {
  const list = dealBooks.value ?? []
  const remote = list.filter((b) => b.image?.startsWith('http'))
  return (remote.length >= 3 ? remote : list).slice(0, 4)
})

const remaining = ref({ hours: '۰۰', minutes: '۰۰', seconds: '۰۰' })
let timer: ReturnType<typeof setInterval> | null = null

const countdownUnits = computed(() => [
  { label: 'ساعت', value: remaining.value.hours },
  { label: 'دقیقه', value: remaining.value.minutes },
  { label: 'ثانیه', value: remaining.value.seconds },
])

function padFa(n: number) {
  return new Intl.NumberFormat('fa-IR', { minimumIntegerDigits: 2 }).format(n)
}

function tick() {
  const now = new Date()
  const end = new Date(now)
  end.setHours(23, 59, 59, 999)
  const diff = Math.max(0, end.getTime() - now.getTime())
  const hours = Math.floor(diff / 3_600_000)
  const minutes = Math.floor((diff % 3_600_000) / 60_000)
  const seconds = Math.floor((diff % 60_000) / 1000)
  remaining.value = {
    hours: padFa(hours),
    minutes: padFa(minutes),
    seconds: padFa(seconds),
  }
}

onMounted(() => {
  tick()
  timer = setInterval(tick, 1000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})

async function copyCoupon() {
  try {
    await navigator.clipboard.writeText(couponCode)
    toast.success({
      message: `کد ${couponCode} کپی شد`,
      position: 'topRight',
      timeout: 2200,
    })
  } catch {
    toast.info({
      message: `کد تخفیف: ${couponCode}`,
      position: 'topRight',
      timeout: 2800,
    })
  }
}

const swiperInstance = ref<SwiperClass | null>(null)
const swiperReady = ref(false)
const onSwiper = (swiper: SwiperClass) => {
  swiperInstance.value = swiper
  swiperReady.value = true
}
const slideNext = () => swiperInstance.value?.slideNext()
const slidePrev = () => swiperInstance.value?.slidePrev()
</script>

<style scoped>
.deal-percent {
  position: absolute;
  left: -4%;
  bottom: -18%;
  font-size: clamp(8rem, 28vw, 18rem);
  font-weight: 900;
  line-height: 0.8;
  color: #dcf763;
  opacity: 0.12;
  pointer-events: none;
  user-select: none;
}

.deal-cover {
  display: block;
  overflow: hidden;
  border-radius: 0.9rem;
  border: 2px solid rgba(255, 255, 255, 0.18);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.28);
  animation: deal-float 5.5s ease-in-out infinite;
}

.deal-cover:nth-child(2) {
  transform: translateY(-12px);
}

.deal-cover:nth-child(3) {
  transform: translateY(8px);
}

.deal-cover:nth-child(4) {
  transform: translateY(-6px);
}

.deal-cover:hover {
  transform: translateY(-10px) scale(1.03);
}

@keyframes deal-float {
  0%,
  100% {
    translate: 0 0;
  }
  50% {
    translate: 0 -8px;
  }
}

.peek-swiper {
  overflow: visible !important;
}
.peek-slide-deal {
  width: min(88vw, 400px);
  flex-shrink: 0;
  display: flex;
  height: auto;
}
@media (min-width: 640px) {
  .peek-slide-deal {
    width: auto;
  }
}
.swiper-slide {
  display: flex;
  height: auto;
}

@media (prefers-reduced-motion: reduce) {
  .deal-cover {
    animation: none;
  }
}
</style>
