<template>
  <div
  class="flex flex-row gap-3 p-4 min-w-[420px] max-w-[410px] h-[320px] rounded-xl shadow hover:shadow-lg transition relative bg-gray-100"
  dir="rtl"
>

    <!-- تصویر محصول -->
    <div class="flex-shrink-0 w-[45%]">
      <NuxtImg
        :src="product.image"
        alt="product image"
        class="w-full h-full object-cover rounded-xl"
        format="webp"
      />
    </div>

    <!-- جزئیات -->
<div class="flex flex-col justify-between w-[55%] p-2 sm:p-4 h-full">
      <div>
        <p class="text-[#848C8E] text-xs mb-1">نویسنده‌ی کتاب</p>
        <h2 class="text-sm sm:text-lg font-bold mb-2 truncate">{{ product.title }}</h2>

        <p class="text-[#848C8E] text-xs mb-1">قیمت کتاب</p>
        <h2 class="text-sm sm:text-lg font-semibold mb-4">{{ formattedPrice }}</h2>
      </div>

      <!-- امتیاز -->
      <div class="flex items-center gap-2 mb-3 sm:mb-4">
        <div
          class="flex items-center gap-1 rounded-2xl px-3 py-1 bg-[#DCF763] border border-[#435058] text-[#435058] text-xs sm:text-sm"
        >
          <img src="/images/Vector-(3).svg" alt="rating icon" class="w-3 h-3 sm:w-4 sm:h-4" />
          <span>{{ product.rating || '0.0' }}</span>
        </div>
        <p class="text-[#848C8E] text-xs">140 نظر</p>
      </div>
<!-- فروش رفته -->
      <div class="w-full max-w-full sm:max-w-[200px]">
        <p class="text-sm sm:text-base">فروش رفته <span class="font-bold">21/99</span></p>
        <div class="relative w-full h-2 bg-[#848C8E] rounded-lg mb-5 overflow-hidden">
          <div
            class="absolute bg-[#DCF763] h-full rounded-lg"
            :style="{ width: '70%' }"
          ></div>
        </div>
      </div>

      <!-- دکمه -->
      <button
        type="button"
        class="w-full sm:w-auto bg-[#435058] rounded-full text-white flex items-center justify-center gap-2 px-4 sm:px-6 py-1.5 sm:py-2 hover:bg-[#5b6a6a] transition whitespace-nowrap shrink-0"
      >
        افزودن به سبد
        <img src="/images/user.svg" alt="add to cart icon" class="w-3 h-3 sm:w-4 sm:h-4" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NuxtImg } from '#components'

const props = defineProps<{
  product: {
    id: string | number
    title: string
    image: string
    price: number
    rating?: number
  }
}>()

const formattedPrice = computed(
  () => new Intl.NumberFormat('fa-IR').format(props.product.price) + ' تومان'
)
</script>
