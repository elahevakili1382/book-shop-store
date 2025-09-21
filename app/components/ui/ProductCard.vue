<template>
  <div
    class="flex flex-col justify-between items-center py-3 flex-shrink-0 
           w-full max-w-[300px] sm:max-w-[310px] md:max-w-[300px] 
           transition hover:shadow-xl hover:rounded-1xl hover:scale-105"
  >
    <!-- تصویر کتاب (کلیک → صفحه جزئیات) -->
    <NuxtLink :to="productUrl" class="w-full h-[420px] relative flex-shrink-0">
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
    </NuxtLink>

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

    <!-- نویسنده و عنوان (کلیک → صفحه جزئیات) -->
    <NuxtLink :to="productUrl" class="block w-full px-4">
      <p class="text-[#848C8E] text-xs mb-1 truncate">نویسنده‌ی کتاب</p>
      <h2 class="text-lg font-bold mb-1 truncate">{{ product.title }}</h2>
      <p class="text-[#848C8E] text-xs mb-2">قیمت کتاب</p>
      <h2 class="text-lg font-semibold mb-4 truncate">{{ formattedPrice }}</h2>
    </NuxtLink>

    <!-- دکمه افزودن به سبد (کلیک → فقط addToCart) -->
    <div class="w-full flex justify-center">
      <button
        @click="addProduct"
        class="bg-[#435058] rounded-full text-white flex items-center justify-center
               px-16 py-3 hover:bg-[#5b6a6a] transition w-auto max-w-[330px]"
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
import { NuxtImg, NuxtLink } from '#components'

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

// URL تمیز برای صفحه جزئیات محصول
const productUrl = computed(() => {
  // اگر id شامل '/works/' هست، اون رو پاک می‌کنیم
  return `/product/${props.product.id.toString().replace('/works/', '')}`
})

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
