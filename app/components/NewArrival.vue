<template>
  <section class="w-full mx-auto mt-12 px-4 sm:px-10 h-auto">
    <!-- Header -->
    <div class="w-full flex justify-between items-center mb-3">
      <h2 class="text-2xl font-bold mb-6">جدیدترین محصولات</h2>

      <div class="flex gap-2">
        <button
          @click="slidePrev"
          :disabled="!swiperReady"
          class="rounded-full p-3 bg-[#F1F2EE] outline outline-1 cursor-pointer"
          aria-label="قبلی"
        >
          <NuxtImg src="/images/Vector-(1).svg" alt="prev" width="16" height="16" />
        </button>
        <button
          @click="slideNext"
          :disabled="!swiperReady"
          class="rounded-full p-3 bg-[#DCF763] outline outline-1 cursor-pointer"
          aria-label="بعدی"
        >
          <NuxtImg src="/images/Vector-(2).svg" alt="next" width="16" height="16" />
        </button>
      </div>
    </div>

    <!-- Swiper (Client-only) -->
    <ClientOnly>
      <Swiper
        v-if="productStore.products.length"
        ref="swiperRef"
        :slides-per-view="'auto'"
        :space-between="10"
        grab-cursor
        class="!overflow-hidden"
        @swiper="onSwiper"
      >
        <SwiperSlide
          v-for="product in productStore.products"
          :key="product.id"
          class="!w-[180px] sm:!w-[220px] md:!w-[250px]"
        >
          <NuxtLink :to="`/product/${product.id}`">
            <ProductCard :product="product" />
          </NuxtLink>
        </SwiperSlide>
      </Swiper>
    </ClientOnly>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import ProductCard from '@/components/ui/ProductCard.vue'
import { useProductStore } from '~/stores/productStore'
import type SwiperClass from 'swiper'

import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

const productStore = useProductStore()

// فراخوانی searchProducts با یک query پیش‌فرض
onMounted(() => {
  productStore.searchProducts('programming') // مثال: 'programming' به عنوان query پیش‌فرض
})

const swiperRef = ref<SwiperClass | null>(null)
const swiperInstance = ref<SwiperClass | null>(null)
const swiperReady = ref(false)

const onSwiper = (swiper: SwiperClass) => {
  swiperInstance.value = swiper
  swiperReady.value = true
}
const slideNext = () => swiperInstance.value?.slideNext()
const slidePrev = () => swiperInstance.value?.slidePrev()
</script>
