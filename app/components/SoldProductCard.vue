<template>
  <div
    class="group flex flex-row gap-4 p-4 w-full max-w-[420px] h-full min-h-[180px] rounded-3xl bg-white border border-slate/8 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 mx-auto"
    dir="rtl"
  >
    <NuxtLink :to="productUrl" class="shrink-0">
      <NuxtImg
        :src="product.image || '/images/default-book.jpg'"
        :alt="product.title"
        width="120"
        height="160"
        class="w-[100px] sm:w-[110px] h-[140px] object-cover rounded-2xl"
        format="webp"
      />
    </NuxtLink>

    <div class="flex flex-col justify-between flex-1 min-w-0 py-1">
      <div>
        <p class="text-[10px] font-bold tracking-wide text-slate/40 mb-1">پیشنهاد ویژه</p>
        <NuxtLink :to="productUrl">
          <h3 class="text-sm font-bold text-slate truncate mb-1 group-hover:text-slate/80">
            {{ product.title }}
          </h3>
        </NuxtLink>
        <p class="text-base font-black text-slate">{{ formattedPrice }}</p>
      </div>

      <div>
        <div class="flex items-center justify-between text-[10px] text-slate/45 mb-1.5">
          <span>فروش رفته</span>
          <span class="font-bold text-slate/60">21 / 99</span>
        </div>
        <div class="h-1 rounded-full bg-slate/10 overflow-hidden mb-3">
          <div class="h-full w-[70%] rounded-full bg-slate/35" />
        </div>

        <button
          type="button"
          class="w-full py-2 rounded-xl bg-slate text-white text-xs font-bold flex items-center justify-center gap-1.5 hover:opacity-90 transition-opacity"
          @click="addToCart"
        >
          <AppIcon icon="mdi:cart-plus" class="w-3.5 h-3.5" />
          افزودن به سبد
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useCartStore } from '../stores/cart'
import type { Product } from '../../types/types'

const props = defineProps<{ product: Product }>()
const cartStore = useCartStore()
const toast = useToast()

const formattedPrice = computed(
  () => new Intl.NumberFormat('fa-IR').format(props.product.price) + ' تومان'
)

const productUrl = computed(() => {
  const slug = props.product.title.toLowerCase().replace(/\s+/g, '-')
  return `/product/${slug}`
})

function addToCart() {
  cartStore.addToCart(
    {
      id: props.product.id,
      name: props.product.title,
      price: props.product.price,
      image: props.product.image || '/images/default-book.jpg',
    },
    1
  )
  toast.success({
    message: `«${props.product.title}» به سبد خرید اضافه شد`,
    position: 'topRight',
    timeout: 2400,
  })
}
</script>
