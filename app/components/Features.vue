<template>
  <section
    class="w-full mx-auto mt-14 px-4 sm:px-10 py-10
           rounded-[32px] bg-gradient-to-br">
    
    <!-- Header -->
    <div class="w-full flex justify-between items-center mb-8">
      <h1 class="text-3xl font-extrabold text-[#435058]">خرید با دسته‌بندی</h1>

      <div class="flex gap-3">
        <!-- Prev -->
        <button
          @click="slidePrev"
          class="rounded-full p-3 bg-white border border-gray-200 shadow-sm
                 hover:bg-gray-100 hover:shadow-lg transition disabled:opacity-40">
          <NuxtImg src="/images/Vector-(2).svg" width="16" height="16" />
        </button>

        <!-- Next -->
        <button
          @click="slideNext"
          class="rounded-full p-3 bg-fruit-yellow border border-[#c7e844] shadow-sm
                 hover:bg-[#d5f356] hover:shadow-lg transition disabled:opacity-40">
          <NuxtImg src="/images/Vector-(1).svg" width="16" height="16" />
        </button>
      </div>
    </div>

    <!-- Swiper -->
    <ClientOnly>
      <Swiper
        v-if="categories.length"
        :slides-per-view="'auto'"
        :space-between="20"
        grab-cursor
        @swiper="onSwiper"
        class="!pb-4"
      >
        <SwiperSlide
          v-for="cat in categories"
          :key="cat.id"
          class="!w-[190px] sm:!w-[210px] md:!w-[230px] flex-shrink-0"
        >
          <NuxtLink
            :to="`/category/${cat.slug}`"
            class="flex items-center gap-3 p-5 h-[100px]
                   rounded-3xl bg-[#ffffff] border border-[#eef0ea]
                   shadow-[0_8px_20px_rgba(0,0,0,0.05)]
                   hover:-translate-y-2 hover:shadow-xl
                   hover:bg-[#f9fbea] transition-all duration-300"
          >
            <NuxtImg
              :src="cat.icon"
              width="38"
              height="38"
              class="object-contain"
              format="webp"
            />

            <div>
              <p class="text-lg font-semibold text-[#435058]">{{ cat.name }}</p>
              <p class="text-xs text-blue-800 font-medium">{{ cat.items }} مورد</p>
            </div>
          </NuxtLink>
        </SwiperSlide>
      </Swiper>
    </ClientOnly>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCategoryStore } from '../stores/categories'
import { Swiper, SwiperSlide } from 'swiper/vue'
import type { Swiper as SwiperClass } from 'swiper'
import 'swiper/css'

const categoryStore = useCategoryStore()
await categoryStore.fetchCategories()

const categories = computed(() => categoryStore.categories)

// Swiper Controls
const swiperInstance = ref<SwiperClass | null>(null)
const swiperReady = ref(false)

const onSwiper = (swiper: SwiperClass) => {
  swiperInstance.value = swiper
  swiperReady.value = true
}

const slideNext = () => swiperInstance.value?.slideNext()
const slidePrev = () => swiperInstance.value?.slidePrev()
</script>
