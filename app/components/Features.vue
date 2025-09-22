<template>
  <section class="w-full mx-auto mt-12 px-4 sm:px-10">
    <!-- Header -->
    <div class="w-full flex justify-between items-center mb-3">
      <h1 class="text-2xl font-bold mb-6">خرید با دسته‌بندی</h1>
      <div class="flex gap-2">
        <button
          @click="slidePrev"
          class="rounded-full p-3 bg-[#F1F2EE] cursor-pointer"
          :disabled="!swiperReady"
        >
          <NuxtImg src="/images/Vector-(2).svg" alt="prev" width="16" height="16" />
        </button>
        <button
          @click="slideNext"
          class="rounded-full p-3 bg-fruit-yellow cursor-pointer"
          :disabled="!swiperReady"
        >
          <NuxtImg src="/images/Vector-(1).svg" alt="next" width="16" height="16" />
        </button>
      </div>
    </div>

    <!-- Swiper -->
<ClientOnly>
  <Swiper
    v-if="categories.length"
    :slides-per-view="'auto'"
    :space-between="16"
    :pagination="{ clickable: true }"
    grab-cursor
    class="overflow-hidden rounded-3xl !pb-4"
    @swiper="onSwiper"
  >
    <SwiperSlide
      v-for="cat in categories"
      :key="cat.id"
      class="!w-[180px] sm:!w-[200px] md:!w-[220px] flex-shrink-0"
    >
      <NuxtLink
        :to="`/category/${cat.slug}`"
        class="flex flex-col justify-center items-start p-4 gap-2 h-[90px] rounded-3xl bg-[#F1F2EE]"
      >
        <div class="flex items-center gap-4">
          <NuxtImg
            :src="cat.icon"
            :alt="cat.name"
            width="32"
            height="32"
            format="webp"
            class="object-contain"
          />
          <div>
            <p class="text-lg text-black">{{ cat.name }}</p>
            <p class="text-xs text-gray-500">{{ cat.items }} مورد</p>
          </div>
        </div>
      </NuxtLink>
    </SwiperSlide>
  </Swiper>
</ClientOnly>

  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCategoryStore } from '@/stores/categories'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Pagination } from 'swiper/modules'
import type { Swiper as SwiperClass } from 'swiper'
import 'swiper/css'
import 'swiper/css/pagination'

// --- store ---
const categoryStore = useCategoryStore()
await categoryStore.fetchCategories()
const categories = computed(() => categoryStore.categories)

// --- swiper state ---
const swiperInstance = ref<SwiperClass | null>(null)
const swiperReady = ref(false)

const onSwiper = (swiper: SwiperClass) => {
  swiperInstance.value = swiper
  swiperReady.value = true
}

const slideNext = () => swiperInstance.value?.slideNext()
const slidePrev = () => swiperInstance.value?.slidePrev()
</script>
