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

    <div class="flex min-w-0 flex-1 flex-col justify-between py-1">
      <div>
        <p class="mb-1 text-[10px] font-bold tracking-wide text-slate/40">پیشنهاد ویژه</p>
        <NuxtLink :to="productUrl">
          <h3 class="mb-1 truncate text-sm font-bold text-slate group-hover:text-slate/80">
            {{ product.title }}
          </h3>
        </NuxtLink>
        <p class="text-base font-black text-slate">{{ formattedPrice }}</p>
      </div>

      <div>
        <div class="mb-1.5 flex items-center justify-between text-[10px] text-slate/45">
          <span>فروش رفته</span>
          <span class="font-bold text-slate/60">21 / 99</span>
        </div>
        <div class="mb-3 h-1 overflow-hidden rounded-full bg-slate/10">
          <div class="h-full w-[70%] rounded-full bg-slate/35" />
        </div>
        <button
          type="button"
          class="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate text-white hover:bg-lime hover:text-slate"
          aria-label="افزودن به سبد خرید"
          @click="addToCart"
        >
          <AppIcon icon="mdi:cart-plus" class="h-5 w-5" />
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
