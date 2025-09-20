<script setup lang="ts">
import { onMounted } from "vue"
import ProductCard from "@/components/ui/ProductCard.vue"
import { Swiper, SwiperSlide } from "swiper/vue"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
import { Navigation, Pagination } from "swiper/modules"
import { useProductStore } from "@/stores/productStore"

const store = useProductStore()

onMounted(async () => {
  await store.fetchAllCategoriesProducts()
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
    <h1
      class="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-800 mb-10 flex justify-center relative"
    >
      تازه‌ها
      <span class="absolute left-0 bottom-0 w-12 h-1 bg-[#DCF763] rounded-full"></span>
    </h1>

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
      <div v-for="row in 5" :key="row">
        <Swiper
          navigation
          pagination
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
            class="flex justify-center"
          >
            <ProductCard :product="product" />
          </SwiperSlide>
        </Swiper>
      </div>
    </div>
  </section>
</template>
