<template>
  <section
    class="flex flex-col gap-8 relative max-w-[1200px] w-full mx-auto mt-[120px] p-10 bg-[#435058]/[0.08] border border-[#435058]/[0.15] rounded-[40px]"

  >
    <!-- هدر -->
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold">خرید با دسته‌بندی</h1>
      <div class="flex gap-2">
        <button @click="slidePrev" class="rounded-full p-3 bg-[#F1F2EE] outline outline-1 cursor-pointer" :disabled="!swiperReady">
          <img src="/images/Vector-(2).svg" alt="قبلی" />
        </button>
        <button @click="slideNext" class="rounded-full p-3 bg-[#DCF763] outline outline-1 cursor-pointer" :disabled="!swiperReady">
          <img src="/images/Vector-(1).svg" alt="بعدی" />
        </button>
      </div>
    </div>

    <div class="flex flex-col md:flex-row gap-3">
      <!-- ستون دسته‌بندی -->
      <div class="bg-white rounded-3xl w-full md:w-72 p-6 flex-col gap-6 shadow-md shrink-0">
        <h2 class="font-semibold text-lg mb-4">دسته بندی</h2>

        <!-- موبایل: horizontal scroll -->
        <ul class="flex md:hidden overflow-x-auto gap-2 mb-4">
          <li
            v-for="category in store.categories"
            :key="category"
            @click="selectCategory(category)"
            :class="[
              'cursor-pointer px-4 py-2 rounded-lg whitespace-nowrap border',
              store.selectedCategory === category ? 'bg-gray-300 font-bold' : 'bg-white'
            ]"
          >
            {{ category }}
          </li>
        </ul>

        <!-- دسکتاپ: vertical list -->
        <ul class="hidden md:flex flex-col gap-3 text-gray-700">
          <li
            v-for="category in store.categories"
            :key="category"
            @click="selectCategory(category)"
            :class="[
              'cursor-pointer hover:text-gray-900 hover:font-bold px-4 py-2 rounded-lg',
              store.selectedCategory === category ? 'bg-gray-300 font-bold' : ''
            ]"
          >
            {{ category }}
          </li>
        </ul>
      </div>

      <!-- Swiper -->
<div class="flex-1 overflow-hidden">
        <div v-if="isLoading" class="flex justify-center items-center h-80 w-full">
          <span class="text-gray-500 text-lg">در حال بارگذاری ...</span>
        </div>

        <ClientOnly v-else>
  <Swiper
  :slides-per-view="'auto'"
  :space-between="20"
    @swiper="onSwiper"   

  :breakpoints="{
 640: { slidesPerView: 1 },
    768: { slidesPerView: 2 },
    1024: { slidesPerView: 'auto' }
  }"
  grab-cursor
  ref="swiperRef"
  :rtl="true"
>
<SwiperSlide
    v-for="product in products"
    :key="product.id"
              class="flex !w-[180px] sm:!w-[220px] md:!w-[250px] flex-shrink-0"
 >
    <ProductCard :product="product" />
  </SwiperSlide>
</Swiper>

        </ClientOnly>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import ProductCard from '@/components/ui/ProductCard.vue'
import { useCategoryProductStore } from '@/stores/categoryProducts'


const store = useCategoryProductStore()

const products = computed(() => store.filteredProducts)
const isLoading = computed(() => store.isLoading)

const swiperRef = ref<any>(null)    
const swiperInstance = ref<any>(null)
const swiperReady = ref(false)

const onSwiper = (swiper: any) => {
  swiperInstance.value = swiper
  swiperReady.value = true
}

const slideNext = () => swiperInstance.value?.slideNext()
const slidePrev = () => swiperInstance.value?.slidePrev()

function selectCategory(category: string) {
  store.setSelectedCategory(category)
}

// آپدیت خودکار Swiper وقتی محصولات تغییر می‌کنند
watch(products, () => {
  if (swiperInstance.value) {
    setTimeout(() => {
      swiperInstance.value.update()
      swiperInstance.value.slideTo(0)
    }, 50)
  }
})

// بارگذاری اولیه
onMounted(() => {
  store.fetchProducts('biography')
})
</script>
