<template>
  <section class="flex flex-col gap-8 relative max-w-[1200px] w-full mx-auto mt-[80px] p-10 bg-[#dfdcdb] border border-[#435058]/[0.15] rounded-[40px] hover:shadow-2xl">
    <!-- هدر -->
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold">فروش روز</h1>
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

    <div class="flex flex-col md:flex-row gap-4">
      <!-- ستون دسته‌بندی -->
      <div class="bg-white rounded-3xl shadow-2xl w-full md:w-72 p-6 flex-col gap-6 shrink-0">
        <h2 class="font-semibold text-lg mb-4">دسته بندی</h2>

        <!-- موبایل (افقی) -->
        <ul class="flex md:hidden overflow-x-auto gap-2 mb-4">
          <li
            v-for="category in categories"
            :key="category"
            @click="selectCategory(category)"
            :class="[
              'cursor-pointer px-4 py-2 rounded-lg whitespace-nowrap border hover:bg-mello-yellow transition-all duration-300 hover:-translate-y-1  hover:font-bold',
              selectedCategory === category ? 'bg-fruit-yellow font-bold' : 'bg-white border-fruit-yellow'
            ]"
          >
            {{ category }}
          </li>
        </ul>

        <!-- دسکتاپ (عمودی) -->
        <ul class="hidden md:flex flex-col gap-3 text-gray-700">
          <li
            v-for="category in categories"
            :key="category"
            @click="selectCategory(category)"
            :class="[
              'cursor-pointer hover:text-gray-800 hover:bg-mello-yellow transition-all duration-300 hover:-translate-y-1 hover:font-bold px-4 py-2 border rounded-lg',
              selectedCategory === category ? 'bg-fruit-yellow font-bold' : 'border-fruit-yellow'
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
            v-show="products.length"
            :slides-offset-before="0"
            :space-between="12"
            :grab-cursor="true"
             :centered-slides="false"
            @swiper="onSwiper"
            ref="swiperRef"
            :rtl="true"
            :breakpoints="{
              0: { slidesPerView: 1 },
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 4 },
              1280: { slidesPerView: 5 }
            }"
          >
            <SwiperSlide
              v-for="product in products"
              :key="product._key"
              class="flex justify-center w-full md:!w-[250px] flex-shrink-0"
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
import { ref, onMounted, nextTick } from 'vue'
import { useProductStore } from '../stores/productStore'
import ProductCard from '../components/ui/ProductCard.vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import type SwiperClass from 'swiper'
import 'swiper/css'

// استور محصولات
const store = useProductStore()

// state
const categories = [
  'برنامه‌نویسی و کامپیوتر', 'تاریخ', 'بیوگرافی عمومی', 'فانتزی',
  'علوم', 'هنر', 'ورزش و ورزشکاران', 'کتاب کودک', 'رمان عاشقانه'
]
const selectedCategory = ref('بیوگرافی عمومی')
const products = ref<any[]>([])
const isLoading = ref(true)

// Swiper
const swiperRef = ref<SwiperClass | null>(null)
const swiperInstance = ref<SwiperClass | null>(null)
const swiperReady = ref(false)
const onSwiper = (swiper: SwiperClass) => { swiperInstance.value = swiper; swiperReady.value = true }
const slideNext = () => swiperInstance.value?.slideNext()
const slidePrev = () => swiperInstance.value?.slidePrev()

// map دسته‌بندی‌ها به key API
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

// fetch محصولات با nextTick و update Swiper
const fetchProducts = async (category: string) => {
  isLoading.value = true
  try {
    await store.fetchCategoryProducts(category)
    products.value = store.products.map(p => ({
      ...p,
      _key: p.id + category
    }))
    await nextTick()
    swiperInstance.value?.update() // آپدیت Swiper بعد از تغییر داده‌ها
  } catch (err) {
    console.error(err)
  } finally {
    isLoading.value = false
  }
}

// بارگذاری اولیه
onMounted(() => fetchProducts(selectedCategory.value))

// وقتی دسته‌بندی تغییر کرد
const selectCategory = (category: string) => {
  selectedCategory.value = category
  fetchProducts(category)
}
</script>

<style scoped>
button:hover { cursor: pointer; }
/* Swiper slide smooth */
.swiper-slide { transition: transform 0.3s ease-in-out; }
</style>
