<template>
  <section class="w-full mx-auto mt-12 px-4 sm:px-10">
    <!-- هدر -->
    <div class="w-full flex justify-between items-center mb-3">
      <h2 class="text-2xl font-bold mb-6">فروش های روز</h2>
      <div class="flex gap-2">
        <button
          @click="slidePrev"
          :disabled="!swiperReady"
          class="rounded-full p-3 bg-[#F1F2EE] cursor-pointer disabled:opacity-50"
        >
          <img src="/images/Vector-(1).svg" alt="prev" />
        </button>
        <button
          @click="slideNext"
          :disabled="!swiperReady"
          class="rounded-full p-3 bg-[#DCF763] cursor-pointer disabled:opacity-50"
        >
          <img src="/images/Vector-(2).svg" alt="next" />
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
        :space-between="16"
        :grab-cursor="true"
        :centered-slides="false"
        @swiper="onSwiper"
        ref="swiperRef"
        class="!overflow-hidden"
        :breakpoints="{
          0: { slidesPerView: 1 },
          640: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 }
        }"
      >
        <SwiperSlide
          v-for="product in products"
          :key="product.id"
          class="flex justify-center w-full md:w-auto flex-shrink-0"
        >
          <SoldProductCard :product="product" class="h-full w-full" />
        </SwiperSlide>
      </Swiper>
    </ClientOnly>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import type SwiperClass from 'swiper'
import type { Product } from '../../types/types'
import SoldProductCard from '../components/SoldProductCard.vue'
import { useProductStore } from '../stores/productStore'
import 'swiper/css'

const store = useProductStore()

// --- state محلی
const products = ref<Product[]>([])
const isLoading = ref(false)
const error = ref<string | null>(null)

// --- Swiper
const swiperRef = ref<SwiperClass | null>(null)
const swiperInstance = ref<SwiperClass | null>(null)
const swiperReady = ref(false)
const onSwiper = (swiper: SwiperClass) => {
  swiperInstance.value = swiper
  swiperReady.value = true
}
const slideNext = () => swiperInstance.value?.slideNext()
const slidePrev = () => swiperInstance.value?.slidePrev()

// --- fetch محصولات فقط برای این کامپوننت
async function loadProducts(query: string) {
  isLoading.value = true
  error.value = null
  try {
    await store.searchProducts(query)
    products.value = store.products.map(p => ({ ...p }))
  } catch (err: unknown) {
    error.value = err instanceof Error ? err.message : 'خطای ناشناخته'
  } finally {
    isLoading.value = false
  }
}

// --- بارگذاری اولیه
onMounted(() => {
  loadProducts('programming') // مثال: query پیش‌فرض
})
</script>

<style scoped>
.swiper-slide {
  display: flex;
  justify-content: center;
  align-items: stretch;
}
</style>
