<template>
  <div
    class="flex flex-col justify-between items-center py-2 sm:py-3 
           w-[85%] sm:w-full max-w-[300px] transition hover:shadow-xl hover:rounded-1xl hover:scale-105 mx-auto"
  >
    <!-- تصویر کتاب -->
    <NuxtLink :to="productUrl" class="w-full relative">
      <NuxtImg
        :src="product.image"
        :alt="product.title"
        class="w-full h-[320px] sm:h-[420px] object-cover rounded-2xl"
        :sizes="sizes"
        width="280"
        height="420"
        format="webp"
        priority
      />
    </NuxtLink>

    <!-- امتیاز و تعداد نظر -->
    <div class="flex items-center gap-2 mt-2 sm:mt-3 mb-2 w-full px-3 sm:px-4">
      <div
        class="flex items-center gap-1 rounded-2xl px-3 py-1 bg-[#DCF763] border border-[#435058] text-[#435058] text-xs sm:text-sm"
      >
        <NuxtImg src="/images/Vector-(3).svg" alt="امتیاز" width="16" height="16" />
        <span>{{ product.rating || '0.0' }}</span>
      </div>
      <p class="text-[#848C8E] text-xs sm:text-sm">140 نظر</p>
    </div>

    <!-- نویسنده و عنوان -->
    <NuxtLink :to="productUrl" class="block w-full px-3 sm:px-4">
      <p class="text-[#848C8E] text-xs sm:text-sm mb-1 truncate">نویسنده‌ی کتاب</p>
      <h2 class="text-sm sm:text-lg font-bold mb-1 truncate">{{ product.title }}</h2>
      <p class="text-[#848C8E] text-xs sm:text-sm mb-2">قیمت کتاب</p>
      <h2 class="text-sm sm:text-lg font-semibold mb-3 truncate">{{ formattedPrice }}</h2>
    </NuxtLink>

    <!-- دکمه افزودن -->
    <div class="w-full flex justify-center">
      <button
        @click.stop="addProduct"
        class="bg-[#435058] rounded-full text-white flex items-center justify-center
               px-8 sm:px-16 py-2 sm:py-3 hover:bg-[#5b6a6a] transition w-auto max-w-[280px] sm:max-w-[330px]"
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
const toast = useToast()

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

const productUrl = computed(() => `/product/${props.product.id}`)

function addProduct() {
  cartStore.addToCart(
    {
      id: props.product.id,
      name: props.product.title,
      price: props.product.price,
      image: props.product.image,
    },
    1
  )

  toast.success({
    message: `محصول "${props.product.title}" به سبد خرید اضافه شد.`,
    color: 'green',
    position: 'topRight',
  })
}

const sizes = '(max-width: 640px) 90vw, (max-width: 768px) 250px, 300px'
</script>

<style scoped>
button:hover { cursor: pointer; }
</style>
