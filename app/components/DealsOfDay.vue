<template>
  <section class="w-full mx-auto mt-12 px-4 sm:px-10">
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

    <div v-if="isLoading" class="flex justify-center items-center h-40">
      <span class="text-gray-500 text-lg">در حال بارگذاری ...</span>
    </div>

    <ClientOnly v-else>
      <Swiper
        v-if="products.length"
        :slides-per-view="'auto'"
        :space-between="16"
        ref="swiperRef"
        grab-cursor
        class="!overflow-hidden"
        @swiper="onSwiper"
        :breakpoints="{ 640: { slidesPerView: 1 }, 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }"
      >
        <SwiperSlide
          v-for="product in products"
          :key="product.id"
          class="flex justify-center"
        >
          <SoldProductCard :product="product" class="h-full" />
        </SwiperSlide>
      </Swiper>
    </ClientOnly>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import type SwiperClass from 'swiper'
import type { Product } from '~/stores/productStore'
import SoldProductCard from '~/components/SoldProductCard.vue'
import { useProductStore } from '~/stores/productStore'

import 'swiper/css'

const productStore = useProductStore()

// فراخوانی searchProducts با یک query مشخص
onMounted(() => {
  productStore.searchProducts('programming') // مثال: برنامه‌نویسی به عنوان query پیش‌فرض
})

const products = computed<Product[]>(() => productStore.products)
const isLoading = computed(() => productStore.isLoading)

const swiperRef = ref<SwiperClass | null>(null)
const swiperInstance = ref<SwiperClass | null>(null)
const swiperReady = ref(false)

function onSwiper(swiper: SwiperClass) {
  swiperInstance.value = swiper
  swiperReady.value = true
}

function slideNext() {
  swiperInstance.value?.slideNext()
}

function slidePrev() {
  swiperInstance.value?.slidePrev()
}
</script>

<style scoped>
.swiper-slide {
  display: flex;
  justify-content: center;
  align-items: stretch;
}
</style>
