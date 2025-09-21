<script setup lang="ts">
import { onMounted, computed, ref } from "vue"
import ProductCard from "@/components/ui/ProductCard.vue"
import { Swiper, SwiperSlide } from "swiper/vue"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
import { Navigation, Pagination } from "swiper/modules"
import { useProductStore } from "@/stores/productStore"

const store = useProductStore()
const searchQuery = ref('')
const selectedCategory = ref('')
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

const applyFilter = async () =>{
  if(searchQuery.value){
    await store.searchProducts(searchQuery.value)
  }else if(selectedCategory.value){
    await store.fetchCategoryProducts(selectedCategory.value)
  }else{
    await store.fetchAllCategoriesProducts()
  }
}

onMounted(async () => {
  if(!store.products.length)
  await store.fetchAllCategoriesProducts()
})

const rows = computed(() =>{
  const perRow =10
  const result = []
  for(let i=0; i<5 ; i++){
    result.push(store.products.slice(i*perRow, (i+1) * perRow))
  }
})
// 📌 تقسیم به ۵ ردیف بر اساس store.products
const getRowProducts = (row: number) => {
  const perRow = 10
  const start = (row - 1) * perRow
  return store.products.slice(start, start + perRow)
}
</script>

<template>
  <section class="max-w-[1400px] mx-auto px-4 py-10">
    <h1 class="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-800 mb-2 text-center">
  تازه‌ها
</h1>
<span class="block w-12 h-1 bg-[#DCF763] rounded-full mx-auto mb-10"></span>

<div class="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
  <input
    v-model="searchQuery"
    type="text"
    placeholder="جستجوی کتاب..."
    class="w-full sm:w-1/2 px-4 py-2 border rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-[#DCF763]"
  />
  <select v-model="selectedCategory" class="px-4 py-2 border rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-[#DCF763]">
    <option value="">همه دسته‌ها</option>
    <option v-for="(key, name) in categoryMap" :key="key" :value="name">{{ name }}</option>
  </select>
  <button @click="applyFilter" class="bg-[#DCF763] text-gray-900 px-6 py-2 rounded-lg font-semibold hover:bg-[#c5e450] transition">اعمال فیلتر</button>
</div>




    <!-- وضعیت بارگذاری -->
    <div v-if="store.isLoading" class="text-center py-20 text-gray-500">
      در حال بارگذاری کتاب‌ها...
    </div>

    <!-- خطا -->
    <div v-if="store.error" class="text-center py-20 text-red-500">
      {{ store.error }}
    </div>

    <!-- پنج ردیف جدا -->
    <div v-if="!store.isLoading && !store.error" class="space-y-12">
      <div v-for="row in 5" :key="`row-${row}`" class="relative">
        <button
    :class="`prev-${row}`"
    class="absolute left-0 top-1/2 -translate-y-1/2 z-10 
           w-10 h-10 flex items-center justify-center 
           rounded-full bg-[#DCF763] text-gray-700 shadow hover:bg-[#dcf763eb]"
  >
    ◀
  </button>
  <ClientOnly>
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
        
  <div :class="`pagination-${row}`" class="flex justify-center gap-2 mt-4"></div>
        </Swiper>
  </ClientOnly>
      
          <button
    :class="`next-${row}`"
    class="absolute right-0 top-1/2 -translate-y-1/2 z-10 
           w-10 h-10 flex items-center justify-center 
           rounded-full bg-[#DCF763] text-gray-700 shadow hover:bg-[#dcf763c0]"
  >
    ▶
  </button>
     

      </div>
    </div>
  </section>
</template>
