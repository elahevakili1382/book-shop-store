<template>
  <section class="max-w-[1400px] mx-auto px-4 py-10">
    <!-- تیتر -->
    <h1 class="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-800 mb-2 text-center">
      پیشنهادهای روز
    </h1>
    <span class="block w-12 h-1 bg-[#DCF763] rounded-full mx-auto mb-6"></span>

 <div class="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
  <!-- جستجو -->
  <input
    v-model="searchQuery"
    type="text"
    placeholder="جستجوی کتاب..."
    class="w-full sm:w-1/2 px-4 py-2 border rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-[#DCF763] "
  />

  <!-- سلکت دسته -->
  <select
    v-model="selectedCategory"
    class="px-4 py-2 border rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-[#DCF763] "
  >
    <option value="">همه دسته‌ها</option>
    <option v-for="(key, name) in categoryMap" :key="key" :value="name">{{ name }}</option>
  </select>

  <!-- دکمه اعمال فیلتر -->
  <button
    @click="applyFilter"
    class="bg-[#DCF763] text-gray-900 px-6 py-2 rounded-lg font-semibold hover:bg-[#c5e450] transition "
  >
    اعمال فیلتر
  </button>
</div>


    <!-- وضعیت بارگذاری -->
    <div v-if="store.isLoading" class="text-center py-20 text-gray-500">
      در حال بارگذاری محصولات...
    </div>

    <!-- خطا -->
    <div v-if="store.error" class="text-center py-20 text-red-500">
      {{ store.error }}
    </div>

    <!-- پنج ردیف پیشنهاد روز -->
    <div v-if="!store.isLoading && !store.error" class="space-y-12">
      <div v-for="row in 5" :key="`row-${row}`" class="relative">
        <client-only>
          <Swiper
            :modules="[Navigation, Pagination]"
            :navigation="{prevEl:`.prev-${row}`, nextEl:`.next-${row}`}"
            :pagination="{el:`.pagination-${row}`, clickable:true}"
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

            <!-- Pagination -->
            <div :class="`pagination-${row}`" class="flex justify-center gap-2 mt-4"></div>
          </Swiper>
        </client-only>

        <!-- دکمه قبلی -->
        <button
          :class="`prev-${row}`"
          class="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-[#DCF763] text-gray-700 shadow hover:bg-[#dcf763eb]"
        >
          ◀
        </button>

        <!-- دکمه بعدی -->
        <button
          :class="`next-${row}`"
          class="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-[#DCF763] text-gray-700 shadow hover:bg-[#dcf763c0]"
        >
          ▶
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue"
import ProductCard from "@/components/ui/ProductCard.vue"
import { useProductStore } from "@/stores/productStore"
import { Swiper, SwiperSlide } from "swiper/vue"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
import { Navigation, Pagination } from "swiper/modules"

const store = useProductStore()

// جستجو و فیلتر
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

const applyFilter = () => {
  // فقط رفرش کردن محصولات با فیلتر
  store.products = store.products
    .filter(p => !selectedCategory.value || p.category === selectedCategory.value)
    .filter(p => !searchQuery.value || p.title.includes(searchQuery.value))
}


// بارگذاری اولیه
onMounted(async () => {
  if(!store.products.length) {
    await store.fetchCategoryProducts("پیشنهادهای روز")
  }
})

// تقسیم محصولات به ردیف‌ها
const getRowProducts = (row: number) => {
  const perRow = 10
  let filtered = store.products

  if(searchQuery.value)
    filtered = filtered.filter(p => p.title.includes(searchQuery.value))
  if(selectedCategory.value)
    filtered = filtered.filter(p => p.category === selectedCategory.value)

  const start = (row - 1) * perRow
  return filtered.slice(start, start + perRow)
}

// هندل جستجو و فیلتر
const onSearch = () => {}
const onFilter = () => {}
</script>

<style>
.font-asm {
  font-family: 'Asym', sans-serif;
}
</style>