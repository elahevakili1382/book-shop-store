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

    <!-- بنر Dribbble-style: پشته+ماوس | متن | دو کتاب (RTL) -->
    <ClientOnly>
      <motion.div
        :initial="{ opacity: 0, y: 20 }"
        :while-in-view="{ opacity: 1, y: 0 }"
        :viewport="{ once: true, amount: 0.2 }"
        :transition="{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }"
        class="relative mb-8 overflow-hidden rounded-[2rem]"
      >
        <div
          class="relative grid lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-end gap-2 sm:gap-4 lg:gap-6
                 min-h-[240px] sm:min-h-[280px] lg:min-h-[320px]
                 px-4 pt-8 pb-0 sm:px-6 sm:pt-10 lg:px-8 lg:pt-12
                 bg-[#FFF5EE]"
        >
          <!-- چپ (RTL): پشته کتاب + ماوس -->
          <motion.div
            class="hidden sm:flex justify-center lg:justify-start order-3 self-end"
            :initial="{ opacity: 0, x: -24 }"
            :while-in-view="{ opacity: 1, x: 0 }"
            :viewport="{ once: true }"
            :transition="{ duration: 0.55, delay: 0.12, ease: [0.22, 1, 0.36, 1] }"
          >
            <img
              src="/images/deals-books-right.png"
              alt=""
              width="520"
              height="400"
              class="w-full max-w-[260px] lg:max-w-[320px] xl:max-w-[360px] h-auto object-contain object-bottom
                     drop-shadow-[0_14px_28px_rgba(67,80,88,0.14)]"
              loading="lazy"
              decoding="async"
            />
          </motion.div>

          <!-- وسط: متن + CTA -->
          <div class="text-center order-1 lg:order-2 self-center px-0 sm:px-2 lg:px-6 pb-8 sm:pb-10 lg:pb-12">
            <motion.h3
              :initial="{ opacity: 0, y: 12 }"
              :while-in-view="{ opacity: 1, y: 0 }"
              :viewport="{ once: true }"
              :transition="{ duration: 0.5, delay: 0.08 }"
              class="text-2xl sm:text-[1.85rem] lg:text-[2.15rem] xl:text-4xl font-black text-slate leading-[1.15] mb-2 sm:mb-3"
            >
              تا
              <span class="text-[#FF7A28]">۵۰٪</span>
              تخفیف روی کتاب‌های منتخب!
            </motion.h3>

            <motion.p
              :initial="{ opacity: 0, y: 8 }"
              :while-in-view="{ opacity: 1, y: 0 }"
              :viewport="{ once: true }"
              :transition="{ duration: 0.45, delay: 0.16 }"
              class="text-sm sm:text-base font-bold text-slate mb-5 sm:mb-6 max-w-md mx-auto leading-relaxed"
            >
              چنین پیشنهادی را از دست نده!
            </motion.p>

            <motion.div
              :initial="{ opacity: 0, y: 10 }"
              :while-in-view="{ opacity: 1, y: 0 }"
              :viewport="{ once: true }"
              :transition="{ duration: 0.45, delay: 0.24 }"
              class="flex flex-wrap items-center justify-center gap-3"
            >
              <motion.div :while-hover="{ scale: 1.03 }" :while-tap="{ scale: 0.98 }">
                <NuxtLink
                  to="/daily-offers"
                  class="inline-flex items-center justify-center min-w-[140px] px-6 py-3 rounded-xl
                         bg-[#FF7A28] text-white text-sm font-bold hover:bg-[#E86E22] transition-colors"
                >
                  خرید الان
                </NuxtLink>
              </motion.div>
              <motion.div :while-hover="{ scale: 1.03 }" :while-tap="{ scale: 0.98 }">
                <NuxtLink
                  to="/daily-offers"
                  class="inline-flex items-center justify-center min-w-[140px] px-6 py-3 rounded-xl
                         bg-white border-2 border-slate text-slate text-sm font-bold hover:bg-white/90 transition-colors"
                >
                  دریافت کوپن
                </NuxtLink>
              </motion.div>
            </motion.div>
          </div>

          <!-- راست (RTL): دو کتاب -->
          <motion.div
            class="hidden sm:flex justify-center lg:justify-end order-2 lg:order-1 self-end"
            :initial="{ opacity: 0, x: 24 }"
            :while-in-view="{ opacity: 1, x: 0 }"
            :viewport="{ once: true }"
            :transition="{ duration: 0.55, delay: 0.08, ease: [0.22, 1, 0.36, 1] }"
          >
            <img
              src="/images/deals-books-left.png"
              alt=""
              width="520"
              height="400"
              class="w-full max-w-[260px] lg:max-w-[320px] xl:max-w-[360px] h-auto object-contain object-bottom
                     drop-shadow-[0_14px_28px_rgba(67,80,88,0.14)]"
              loading="lazy"
              decoding="async"
            />
          </motion.div>

          <!-- موبایل: تصاویر زیر متن، چسبیده به پایین -->
          <div class="sm:hidden order-3 col-span-1 flex items-end justify-center gap-3 -mx-1">
            <motion.div
              :initial="{ opacity: 0, y: 12 }"
              :while-in-view="{ opacity: 1, y: 0 }"
              :viewport="{ once: true }"
              :transition="{ duration: 0.4, delay: 0.12 }"
              class="w-[48%] max-w-[180px]"
            >
              <img
                src="/images/deals-books-left.png"
                alt=""
                width="280"
                height="220"
                class="w-full h-auto object-contain object-bottom drop-shadow-[0_10px_20px_rgba(67,80,88,0.12)]"
                loading="lazy"
                decoding="async"
              />
            </motion.div>
            <motion.div
              :initial="{ opacity: 0, y: 12 }"
              :while-in-view="{ opacity: 1, y: 0 }"
              :viewport="{ once: true }"
              :transition="{ duration: 0.4, delay: 0.18 }"
              class="w-[48%] max-w-[180px]"
            >
              <img
                src="/images/deals-books-right.png"
                alt=""
                width="280"
                height="220"
                class="w-full h-auto object-contain object-bottom drop-shadow-[0_10px_20px_rgba(67,80,88,0.12)]"
                loading="lazy"
                decoding="async"
              />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </ClientOnly>

    <div v-if="isLoading" class="flex justify-center items-center h-40 rounded-3xl bg-white border border-slate/8">
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
            v-for="(product, i) in products"
            :key="product.id ?? product._id"
            class="peek-slide-deal h-auto"
          >
            <motion.div
              :initial="{ opacity: 0, y: 12 }"
              :while-in-view="{ opacity: 1, y: 0 }"
              :viewport="{ once: true, amount: 0.2 }"
              :transition="{ delay: i * 0.05, duration: 0.35 }"
              :while-hover="{ y: -3 }"
              class="h-full"
            >
              <SoldProductCard :product="product" />
            </motion.div>
          </SwiperSlide>
        </Swiper>
      </div>
    </ClientOnly>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { motion } from 'motion-v'
import { Swiper, SwiperSlide } from 'swiper/vue'
import type SwiperClass from 'swiper'
import type { Product } from '../../types/types'
import SoldProductCard from './SoldProductCard.vue'
import SectionHeader from './ui/SectionHeader.vue'
import { useProductStore } from '../stores/productStore'
import 'swiper/css'

const store = useProductStore()
const products = ref<Product[]>([])
const isLoading = ref(false)

const swiperInstance = ref<SwiperClass | null>(null)
const swiperReady = ref(false)
const onSwiper = (swiper: SwiperClass) => {
  swiperInstance.value = swiper
  swiperReady.value = true
}
const slideNext = () => swiperInstance.value?.slideNext()
const slidePrev = () => swiperInstance.value?.slidePrev()

async function loadProducts(query: string) {
  isLoading.value = true
  try {
    await store.searchProducts(query)
    products.value = store.products.map((p) => ({ ...p }))
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadProducts('programming')
})
</script>

<style scoped>
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
</style>
