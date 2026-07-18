<template>
  <section class="overflow-x-hidden">
    <SectionHeader
      eyebrow="New Arrivals"
      title="جدیدترین کتاب‌ها"
      link-to="/new"
      link-label="همه تازه‌ها"
      :show-nav="!!products.length && !isLoading"
      :nav-ready="swiperReady"
      @prev="slidePrev"
      @next="slideNext"
    />

    <div v-if="isLoading" class="flex justify-center items-center h-40 rounded-3xl bg-white border border-slate/8">
      <span class="text-slate/50">در حال بارگذاری...</span>
    </div>

    <ClientOnly v-else>
      <div class="overflow-x-hidden -mx-4 px-4">
        <Swiper
          v-if="products.length"
          grab-cursor
          class="peek-swiper"
          slides-per-view="auto"
          @swiper="onSwiper"
          :space-between="12"
          :breakpoints="{
            640: { slidesPerView: 2.15, spaceBetween: 12 },
            768: { slidesPerView: 3, spaceBetween: 16 },
            1024: { slidesPerView: 4, spaceBetween: 16 },
          }"
        >
          <SwiperSlide
            v-for="product in products"
            :key="product.id ?? product._id"
            class="peek-slide h-auto"
          >
            <ProductCard :product="product" />
          </SwiperSlide>
        </Swiper>
      </div>
    </ClientOnly>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import type SwiperClass from 'swiper'
import ProductCard from './ui/ProductCard.vue'
import SectionHeader from './ui/SectionHeader.vue'
import { useProductStore } from '../stores/productStore'
import type { Product } from '../../types/types'
import 'swiper/css'

const productStore = useProductStore()
const localProducts = ref<Product[]>([])
const isLoading = ref(false)
const swiperInstance = ref<SwiperClass | null>(null)
const swiperReady = ref(false)

const onSwiper = (swiper: SwiperClass) => {
  swiperInstance.value = swiper
  swiperReady.value = true
}

const slideNext = () => swiperInstance.value?.slideNext()
const slidePrev = () => swiperInstance.value?.slidePrev()
const products = computed(() => localProducts.value)

onMounted(async () => {
  isLoading.value = true
  try {
    await productStore.fetchCategoryProducts('programming')
    localProducts.value = [...productStore.products]
  } finally {
    isLoading.value = false
  }
})
</script>

<style scoped>
.peek-swiper {
  overflow: visible !important;
}
.peek-slide {
  width: 232px;
  flex-shrink: 0;
  display: flex;
  height: auto;
}
@media (min-width: 640px) {
  .peek-slide {
    width: auto;
  }
}
</style>
