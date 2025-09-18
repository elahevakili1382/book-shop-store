<template>
  <section class="w-full mx-auto mt-12 px-4 sm:px-10 h-auto">
    <!-- Header -->
    <div class="w-full flex justify-between items-center mb-3">
      <h2 class="text-2xl font-bold mb-6">جدیدترین محصولات</h2>

      <div class="flex gap-2">
        <button
          @click="slidePrev"
          :disabled="!swiperReady"
          class="rounded-full p-3 bg-[#F1F2EE] outline outline-1 cursor-pointer disabled:opacity-50"
          aria-label="قبلی"
        >
          <NuxtImg src="/images/Vector-(1).svg" alt="prev" width="16" height="16" />
        </button>
        <button
          @click="slideNext"
          :disabled="!swiperReady"
          class="rounded-full p-3 bg-[#DCF763] outline outline-1 cursor-pointer disabled:opacity-50"
          aria-label="بعدی"
        >
          <NuxtImg src="/images/Vector-(2).svg" alt="next" width="16" height="16" />
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="flex justify-center items-center h-40">
      <span class="text-gray-500 text-lg">در حال بارگذاری ...</span>
    </div>

    <!-- Swiper -->
    <ClientOnly v-else>
      <Swiper
        v-if="products.length"
        ref="swiperRef"
        :slides-per-view="'auto'"
        :space-between="16"
        grab-cursor
        class="!overflow-hidden"
        @swiper="onSwiper"
        :breakpoints="{ 640: { slidesPerView: 1 }, 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }"
      >
        <SwiperSlide
          v-for="product in products"
          :key="product.id"
          class="!w-[180px] sm:!w-[220px] md:!w-[250px] flex justify-center"
        >
          <NuxtLink :to="`/product/${product.id}`" class="w-full h-full">
            <ProductCard :product="product" class="h-full" />
          </NuxtLink>
        </SwiperSlide>
      </Swiper>
    </ClientOnly>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import type SwiperClass from 'swiper'
import ProductCard from '@/components/ui/ProductCard.vue'
import { useProductStore } from '~/stores/productStore'
import type { Product } from '../../types/types'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

const productStore = useProductStore()

// 👇 فقط داده‌های این کامپوننت رو مدیریت می‌کنیم
const localProducts = ref<Product[]>([])
const isLoading = ref<boolean>(false)

const swiperRef = ref<SwiperClass | null>(null)
const swiperInstance = ref<SwiperClass | null>(null)
const swiperReady = ref(false)

const onSwiper = (swiper: SwiperClass) => {
  swiperInstance.value = swiper
  swiperReady.value = true
}

const slideNext = () => swiperInstance.value?.slideNext()
const slidePrev = () => swiperInstance.value?.slidePrev()

// بارگذاری اولیه برای این کامپوننت
onMounted(async () => {
  isLoading.value = true
  try {
    // فقط برای این کامپوننت fetch می‌کنیم
    await productStore.searchProducts('programming') 
    // داده‌ها رو داخل localProducts ذخیره می‌کنیم تا استور global تغییر نکنه
    localProducts.value = [...productStore.products]
  } finally {
    isLoading.value = false
  }
})

const products = computed(() => localProducts.value)
</script>

<style scoped>
.swiper-slide {
  display: flex;
  justify-content: center;
  align-items: stretch;
}
</style>
