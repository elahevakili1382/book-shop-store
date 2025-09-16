<template>
  <section
    class="flex flex-col gap-8 relative max-w-[1200px] w-full mx-auto mt-[120px] p-10 bg-[#435058]/[0.08] border border-[#435058]/[0.15] rounded-[40px]"
  >
    <!-- هدر -->
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold">خرید با دسته‌بندی</h1>
      <div class="flex gap-2">
        <button
          @click="slidePrev"
          class="rounded-full p-3 bg-[#F1F2EE] outline outline-1 cursor-pointer"
          :disabled="!swiperReady"
        >
          <img src="/images/Vector-(2).svg" alt="قبلی" />
        </button>
        <button
          @click="slideNext"
          class="rounded-full p-3 bg-[#DCF763] outline outline-1 cursor-pointer"
          :disabled="!swiperReady"
        >
          <img src="/images/Vector-(1).svg" alt="بعدی" />
        </button>
      </div>
    </div>

    <div class="flex flex-col md:flex-row gap-3">
      <!-- ستون دسته‌بندی -->
      <div class="bg-white rounded-3xl w-full md:w-72 p-6 flex-col gap-6 shadow-md shrink-0">
        <h2 class="font-semibold text-lg mb-4">دسته بندی</h2>

        <ul class="flex md:hidden overflow-x-auto gap-2 mb-4">
          <li
            v-for="category in categories"
            :key="category"
            @click="selectCategory(category)"
            :class="[
              'cursor-pointer px-4 py-2 rounded-lg whitespace-nowrap border',
              selectedCategory === category ? 'bg-gray-300 font-bold' : 'bg-white'
            ]"
          >
            {{ category }}
          </li>
        </ul>

        <ul class="hidden md:flex flex-col gap-3 text-gray-700">
          <li
            v-for="category in categories"
            :key="category"
            @click="selectCategory(category)"
            :class="[
              'cursor-pointer hover:text-gray-900 hover:font-bold px-4 py-2 rounded-lg',
              selectedCategory === category ? 'bg-gray-300 font-bold' : ''
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
            :breakpoints="{ 640: { slidesPerView: 1 }, 768: { slidesPerView: 2 }, 1024: { slidesPerView: 'auto' } }"
            grab-cursor
            ref="swiperRef"
            :rtl="true"
          >
            <SwiperSlide
              v-for="product in filteredProducts"
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
import type SwiperClass from 'swiper'
import ProductCard from '@/components/ui/ProductCard.vue'
import { useProductStore } from '~/stores/productStore'

const store = useProductStore()

// دسته‌بندی‌ها را از استور یا ثابت می‌گیریم
const categories = [
  'برنامه‌نویسی و کامپیوتر',
  'تاریخ',
  'بیوگرافی عمومی',
  'فانتزی',
  'علوم',
  'هنر',
  'ورزش و ورزشکاران',
  'کتاب کودک',
  'رمان عاشقانه'
]

const selectedCategory = ref<string>('بیوگرافی عمومی')

// محصولات فیلترشده
const filteredProducts = computed(() =>
  store.products.filter(p => p.category === selectedCategory.value)
)

const isLoading = computed(() => store.isLoading)

// Swiper
const swiperRef = ref<SwiperClass | null>(null)
const swiperInstance = ref<SwiperClass | null>(null)
const swiperReady = ref(false)

const onSwiper = (swiper: SwiperClass) => {
  swiperInstance.value = swiper
  swiperReady.value = true
}

const slideNext = () => swiperInstance.value?.slideNext()
const slidePrev = () => swiperInstance.value?.slidePrev()

function selectCategory(category: string) {
  selectedCategory.value = category
  // وقتی دسته‌بندی تغییر کرد، محصولات را از استور بگیریم
  const categoryMap: Record<string, string> = {
    'برنامه‌نویسی و کامپیوتر': 'programming',
    'تاریخ': 'history',
    'بیوگرافی عمومی': 'biography',
    'فانتزی': 'fantasy',
    'علوم': 'science',
    'هنر': 'art',
    'ورزش و ورزشکاران': 'sports',
    'کتاب کودک': 'children',
    'رمان عاشقانه': 'romance'
  }
  const apiKey = categoryMap[category]
  if (apiKey) store.searchProducts(apiKey)
}

// بارگذاری اولیه
onMounted(() => {
  store.searchProducts('biography')
})

// به‌روزرسانی Swiper وقتی محصولات تغییر می‌کنند
watch(filteredProducts, () => {
  swiperInstance.value?.update()
})
</script>
