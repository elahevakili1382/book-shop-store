<template>
  <div
    class="flex flex-col justify-between items-center py-3 flex-shrink-0 
           w-full max-w-[300px] sm:max-w-[300px] md:max-w-[300px] 
           transition hover:shadow-xl hover:rounded-2xl hover:scale-105 mx-2"
  >
    <!-- تصویر کتاب -->
    <div class="w-full h-[420px] relative flex-shrink-0">
      <NuxtImg
        :src="product.image"
        :alt="product.title"
        class="absolute inset-0 w-full h-full object-cover rounded-2xl"
        :sizes="sizes"
        width="280"
        height="420"
        format="webp"
        priority
      />
    </div>

    <!-- امتیاز و تعداد نظر -->
    <div class="flex items-center gap-2 mt-3 mb-2 w-full px-4">
      <div
        class="flex items-center gap-1 rounded-2xl px-4 py-1 bg-[#DCF763] border border-[#435058] text-[#435058]"
      >
        <NuxtImg src="/images/Vector-(3).svg" alt="آیکون امتیاز" width="16" height="16" />
        <span>{{ product.rating || '0.0' }}</span>
      </div>
      <p class="text-[#848C8E] text-xs font-normal">140 نظر</p>
    </div>

    <!-- نویسنده -->
    <p class="text-[#848C8E] text-xs w-full px-4 mb-1 truncate">نویسنده‌ی کتاب</p>
    <h2 class="text-lg font-bold w-full px-4 mb-1 truncate">{{ product.title }}</h2>

    <!-- قیمت -->
    <p class="text-[#848C8E] text-xs w-full px-4 mb-2">قیمت کتاب</p>
    <h2 class="text-lg font-semibold w-full px-4 mb-4 truncate">{{ formattedPrice }}</h2>

<div class="w-full flex justify-center px-4">
  <button
    @click="addProduct"
    class="bg-[#435058] rounded-full text-white flex items-center justify-center gap-2 
           px-6 py-2 hover:bg-[#5b6a6a] transition w-auto max-w-[240px]"
  >
    افزودن به سبد
    <NuxtImg src="/images/user.svg" alt="افزودن به سبد خرید" width="18" height="18" />
  </button>
</div>



  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useCartStore } from '@/stores/cart'
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

const cartStore = useCartStore()

const formattedPrice = computed(
  () => new Intl.NumberFormat('fa-IR').format(props.product.price) + ' تومان'
)

function addProduct() {
  cartStore.addToCart({
    id: props.product.id,
    name: props.product.title,
    price: props.product.price
  })
}

// سایز responsive برای NuxtImg
const sizes = '(max-width: 640px) 100vw, (max-width: 768px) 250px, 300px'
</script>
