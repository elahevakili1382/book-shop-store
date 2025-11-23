<template>
  <div
    class="group flex flex-col justify-between rounded-2xl overflow-hidden
           bg-white shadow-md hover:shadow-xl transition-all duration-300
           hover:-translate-y-1 cursor-pointer max-w-[300px] w-[85%] sm:w-full mx-auto"
  >
    <!-- تصویر و لینک فقط اگر openLibraryId معتبر باشد -->
    <NuxtLink v-if="productUrl" :to="productUrl" class="relative w-full overflow-hidden">
      <NuxtImg
        :src="props.product.image || '/images/default-book.jpg'"
        :alt="props.product.title"
        class="w-full h-[320px] sm:h-[420px] object-cover rounded-t-2xl
               transition-transform duration-500 group-hover:scale-110"
        :sizes="sizes"  
        width="280"
        height="420"
        format="webp"
        preload
      />
      <div class="absolute top-3 left-3 bg-fruit-yellow/85 backdrop-blur px-3 py-1 rounded-full flex items-center gap-1 text-xs shadow-sm">
        <NuxtImg src="/images/Vector-(3).svg" width="16" height="16" alt="rating" />
        <span class="font-semibold">{{ props.product.rating || '0.0' }}</span>
      </div>
    </NuxtLink>

    <div class="px-4 py-3 flex flex-col w-full">
      <NuxtLink v-if="productUrl" :to="productUrl">
        <p class="text-gray-500 text-xs sm:text-sm mb-1 truncate">{{ props.product.title }}</p>
        <h2 class="text-base sm:text-lg font-bold text-gray-800 leading-6 mb-1 truncate group-hover:text-[#435058] transition-colors">
          {{ props.product.title }}
        </h2>
        <p class="text-gray-500 text-xs sm:text-sm mt-1">قیمت</p>
        <h3 class="text-base sm:text-lg font-semibold text-gray-700">{{ formattedPrice }}</h3>
      </NuxtLink>
    </div>

    <button @click.stop="addProduct" class="w-[90%] mx-auto mb-4 py-2 sm:py-3 rounded-full bg-[#435058] text-white flex items-center justify-center gap-2 text-sm sm:text-base transition-all duration-300 hover:bg-[#5b6a6a] hover:scale-[1.03] active:scale-95 shadow-lg">
      <span>افزودن به سبد</span>
      <NuxtImg src="/images/user.svg" width="18" height="18" alt="cart" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useCartStore } from '@/stores/cart'

const toast = useToast()

const props = defineProps<{
  product: {
    id: string | number
    openLibraryId?: string
    title: string
    image?: string
    price: number
    rating?: number
  }
}>()

const cartStore = useCartStore()

// فرمت قیمت
const formattedPrice = computed(() =>
  new Intl.NumberFormat('fa-IR').format(props.product.price) + ' تومان'
)

// مسیر امن
const productUrl = computed(() => {
  const slug = props.product.title.toLowerCase().replace(/\s+/g, '-')
  return `/product/${slug}`
})

function addProduct() {
  cartStore.addToCart(
    {
      id: props.product.id,
      name: props.product.title,
      price: props.product.price,
      image: props.product.image || '/images/default-book.jpg'
    },
    1
  )
  toast.success({
    message: `«${props.product.title}» به سبد خرید اضافه شد`,
    position: 'topRight',
    timeout: 2400
  })
}

const sizes = '(max-width: 640px) 90vw, (max-width: 768px) 250px, 300px'
</script>
