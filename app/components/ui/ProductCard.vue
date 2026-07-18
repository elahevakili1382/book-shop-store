<template>
  <div
    class="group flex flex-col h-full rounded-3xl overflow-hidden bg-white border border-slate/8
           shadow-card hover:shadow-card-hover transition-all duration-300
           hover:-translate-y-1.5 cursor-pointer w-full max-w-[280px] mx-auto"
  >
    <NuxtLink v-if="productUrl" :to="productUrl" class="relative block overflow-hidden">
      <div class="relative bg-gradiant-to-b from-cream to-white p-3 pb-0">
        <NuxtImg
          :src="displayImage"
          :alt="props.product.title"
          class="w-full aspect-[4/5] object-cover rounded-2xl
                 transition-transform duration-500 group-hover:scale-[1.04]"
          :sizes="sizes"
          width="260"
          height="320"
          format="webp"
          loading="lazy"
        />

        <span v-if="props.product.category" class="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-slate/90 text-white text-[10px] font-bold">{{ props.product.category }}</span>
        <div
          v-if="props.product.rating"
          class="absolute bottom-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full
                 bg-white/95 backdrop-blur text-xs font-bold text-slate shadow-card"
        >
          <AppIcon icon="mdi:star" class="w-3.5 h-3.5 text-lime" />
          {{ props.product.rating }}
        </div>
      </div>
    </NuxtLink>

    <div class="flex flex-col flex-1 px-4 pt-3 pb-4">
      <NuxtLink v-if="productUrl" :to="productUrl" class="flex-1">
        <h2
          class="text-sm sm:text-base font-bold text-slate leading-snug mb-2 line-clamp-2 min-h-[2.75rem]
                 group-hover:text-slate/80 transition-colors"
        >
          {{ props.product.title }}
        </h2>
        <p class="font-black text-slate">
          {{ formattedPrice }}
        </p>
      </NuxtLink>

      <button
        type="button"
        :disabled="outOfStock"
        class="mt-4 w-full py-2.5 rounded-2xl bg-slate text-white flex items-center justify-center gap-2
               text-sm font-bold transition-all duration-300 hover:opacity-90
               group-hover:bg-lime group-hover:text-slate active:scale-[0.98]
               disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:opacity-50"
        @click.prevent.stop="addProduct"
      >
        <AppIcon icon="mdi:cart-plus" class="w-4 h-4" />
        <span>
          {{ outOfStock ? 'ناموجود' : justAdded ? 'اضافه شد ✓' : 'افزودن به سبد' }}
        </span>

      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useCartStore } from '../../stores/cart'
import { productPath } from '../../utils/slugify'

const toast = useToast()
const justAdded = ref(false)

const props = defineProps<{
  product: {
    id?: string | number
    _id?: string
    slug?:string
    stock?: number
    title: string
    image?: string
    price: number
    rating?: number
    category?:string
  }
}>()

const productId = computed(
  () => props.product.id ?? props.product._id ?? props.product.title
)

const FALLBACK = '/images/NonFictionIcon(1).svg'

const displayImage = computed(() => props.product.image || FALLBACK)

const cartStore = useCartStore()

const formattedPrice = computed(() =>
  new Intl.NumberFormat('fa-IR').format(props.product.price) + ' تومان'
)

const productUrl = computed(() => productPath(props.product))


function isOutOfStock(stock: number): boolean {
  return stock === 0
}


const outOfStock  = computed(() =>{
  const stock = props.product.stock ?? 1
  return isOutOfStock(stock)
})

function addProduct() {
  if(outOfStock.value) return
  cartStore.addToCart(
    {
      id: productId.value,
      name: props.product.title,
      price: props.product.price,
      image: props.product.image || FALLBACK,
    },
    1
  )
  toast.success({
    message: `«${props.product.title}» به سبد خرید اضافه شد`,
    position: 'topRight',
    timeout: 2400,
  })

  justAdded.value = true
  setTimeout(() =>{justAdded.value = false}, 1500)
}

const sizes = '(max-width: 640px) 90vw, (max-width: 768px) 250px, 280px'
</script>
