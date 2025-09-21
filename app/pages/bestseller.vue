<template>
  <section class="max-w-[1400px] mx-auto px-4 py-10">
    <!-- عنوان -->
    <h1 class="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-800 mb-2 text-center">
      پرفروش‌ها
    </h1>
    <span class="block w-12 h-1 bg-[#DCF763] rounded-full mx-auto mb-10"></span>

<!-- جستجو و فیلتر -->
<div class="flex flex-col sm:flex-row items-center gap-4 mb-8 font-asm">
  <!-- جستجوی کتاب -->
  <div class="relative w-full sm:w-1/2">
    <input
      v-model="searchQuery"
      type="text"
      placeholder="جستجوی کتاب..."
      class="w-full px-4 py-2 pl-10 border rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-[#DCF763]"
    />
    <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
           viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z"/>
      </svg>
    </span>
  </div>

  <!-- انتخاب دسته‌بندی (نسخه ساده) -->
  <select
    v-model="selectedCategory"
    class="w-full sm:w-48 px-4 py-2 border rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-[#DCF763]"
  >
    <option value="">همه دسته‌ها</option>
    <option v-for="(key, name) in categoryMap" :key="key" :value="name">{{ name }}</option>
  </select>

  <!-- دکمه اعمال فیلتر -->
  <button
    @click="applyFilter"
    class="flex items-center gap-2 bg-[#DCF763] text-gray-900 px-6 py-2 rounded-lg font-semibold hover:bg-[#c5e450] transition"
  >
    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
         viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L15 12.414V19a1 1 0 01-1.447.894l-4-2A1 1 0 019 17v-4.586L3.293 6.707A1 1 0 013 6V4z"/>
    </svg>
    فیلتر
  </button>
</div>


    <!-- وضعیت بارگذاری -->
    <div v-if="store.isLoading" class="text-center py-20 text-gray-500">
      در حال بارگذاری کتاب‌ها...
    </div>

    <!-- خطا -->
    <div v-if="store.error" class="text-center py-20 text-red-500">
      {{ store.error }}
    </div>

    <!-- پنج ردیف Swiper -->
    <div v-if="!store.isLoading && !store.error" class="space-y-12">
      <div v-for="row in 5" :key="`row-${row}`" class="relative">
        <client-only>
          <Swiper
            :modules="[Navigation, Pagination]"
            :navigation="{ prevEl: `.prev-${row}`, nextEl: `.next-${row}` }"
            :pagination="{ el: `.pagination-${row}`, clickable:true }"
            :space-between="20"
            :slides-per-view="5"
            :breakpoints="{
              320: { slidesPerView: 1 },
              640: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 5 }
            }"
            class="pb-6"
          >
            <SwiperSlide
              v-for="product in getRowProducts(row)"
              :key="product.id"
              class="flex justify-items-center"
            >
              <ProductCard :product="product" />
            </SwiperSlide>
            <div :class="`pagination-${row}`" class="flex justify-center gap-2 mt-4"></div>
          </Swiper>
        </client-only>

        <!-- دکمه‌های navigation بیرون از کارت -->
        <button
          :class="`prev-${row}`"
          class="absolute -left-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-[#DCF763] text-gray-700 shadow hover:bg-[#dcf763eb]"
        >
          ◀
        </button>
        <button
          :class="`next-${row}`"
          class="absolute -right-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-[#DCF763] text-gray-700 shadow hover:bg-[#dcf763c0]"
        >
          ▶
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from "vue"
import { useProductStore } from "@/stores/productStore"
import ProductCard from "@/components/ui/ProductCard.vue"
import { Swiper, SwiperSlide } from "swiper/vue"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
import { Navigation, Pagination } from "swiper/modules"

const store = useProductStore()

const searchQuery = ref("")
const selectedCategory = ref("")
const categoryMap = {
  "برنامه‌نویسی و کامپیوتر": "programming",
  "تاریخ": "history",
  "بیوگرافی عمومی": "biography",
  "فانتزی": "fantasy",
  "علوم": "science",
  "هنر": "art",
  "ورزش و ورزشکاران": "sports",
  "کتاب کودک": "children",
  "رمان عاشقانه": "romance",
}

// گرفتن محصولات پرفروش (فرض می‌کنیم highest rated یا category خاص)
onMounted(async () => {
  if (!store.products.length) {
    await store.fetchCategoryProducts("پرفروش‌ها") // یا category مشخص
  }
})

// تقسیم به ۵ ردیف
const getRowProducts = (row: number) => {
  const perRow = 10
  const start = (row - 1) * perRow
  // فقط محصولات پرفروش: فرض می‌کنیم rating >= 4.5
  const bestSellers = store.products.filter(p => p.rating && p.rating >= 4.5)
  return bestSellers.slice(start, start + perRow)
}

// اعمال جستجو/فیلتر
const applyFilter = async () => {
  if (searchQuery.value) {
    await store.searchProducts(searchQuery.value)
  } else if (selectedCategory.value) {
    await store.fetchCategoryProducts(selectedCategory.value)
  } else {
    await store.fetchCategoryProducts("پرفروش‌ها")
  }
}
</script>
