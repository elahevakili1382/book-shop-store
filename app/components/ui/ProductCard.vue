<template>
  <article
    class="group relative flex h-full w-full flex-col overflow-hidden bg-white"
    :class="compact
      ? 'rounded-xl'
      : 'rounded-2xl border border-slate/8 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover'"
  >
    <NuxtLink
      v-if="productUrl"
      :to="productUrl"
      class="relative block overflow-hidden bg-cream/60"
      :class="compact ? 'rounded-xl' : ''"
    >
      <img
        :src="displayImage"
        :alt="props.product.title"
        class="aspect-[3/4] w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        width="240"
        height="320"
        loading="lazy"
        @error="onCoverError"
      />

      <span
        v-if="index"
        class="absolute right-2 top-1 text-2xl font-black leading-none text-slate/25"
      >
        {{ index }}
      </span>

      <span
        v-if="categoryName && !compact && !index"
        class="absolute right-2.5 top-2.5 rounded-full bg-slate/90 px-2 py-0.5 text-[10px] font-bold text-white"
      >
        {{ categoryName }}
      </span>

      <div
        v-if="props.product.rating && !compact"
        class="absolute bottom-2.5 left-2.5 flex items-center gap-1 rounded-full bg-white/95 px-2 py-1 text-xs font-bold text-slate shadow-card"
      >
        <AppIcon icon="mdi:star" class="h-3.5 w-3.5 text-lime" />
        {{ props.product.rating }}
      </div>

      <button
        v-if="compact"
        type="button"
        :disabled="outOfStock"
        class="absolute bottom-2 left-2 z-10 inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate text-white shadow-card transition-colors hover:bg-lime hover:text-slate disabled:bg-slate/30"
        :aria-label="cartLabel"
        @click.prevent.stop="addProduct"
      >
        <AppIcon :icon="cartIcon" class="h-4 w-4" />
      </button>
    </NuxtLink>

    <div class="flex flex-1 flex-col" :class="compact ? 'px-1.5 pb-2 pt-2' : 'px-3 pb-3 pt-3'">
      <NuxtLink v-if="productUrl" :to="productUrl">
        <h2
          class="line-clamp-2 font-bold leading-snug text-slate group-hover:text-slate/80"
          :class="compact ? 'min-h-[2.25rem] text-[13px]' : 'min-h-[2.5rem] text-sm'"
        >
          {{ props.product.title }}
        </h2>
      </NuxtLink>

      <p v-if="compact && props.product.rating" class="mt-1 flex items-center gap-1 text-[11px] text-slate/50">
        <AppIcon icon="mdi:star" class="h-3 w-3 text-lime" />
        <span class="font-bold text-slate">{{ props.product.rating }}</span>
      </p>

      <div class="mt-auto flex items-center justify-between gap-2" :class="compact ? 'pt-1.5' : 'pt-3'">
        <p class="truncate font-black text-slate" :class="compact ? 'text-[13px]' : 'text-sm'">
          {{ formattedPrice }}
        </p>
        <button
          v-if="!compact"
          type="button"
          :disabled="outOfStock"
          class="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate text-white transition-all duration-300 hover:bg-lime hover:text-slate active:scale-95 disabled:cursor-not-allowed disabled:bg-slate/30 disabled:text-white"
          :aria-label="cartLabel"
          @click.prevent.stop="addProduct"
        >
          <AppIcon :icon="cartIcon" class="h-5 w-5" />
        </button>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useCartStore } from '../../stores/cart'
import { productPath } from '../../utils/slugify'
import { categoryLabel } from '../../utils/categoryLabel'

const notify = useMyToast()
const justAdded = ref(false)

const props = withDefaults(
  defineProps<{
    compact?: boolean
    index?: number
    product: {
      id?: string | number
      _id?: string
      slug?: string
      titleEn?: string
      stock?: number
      title: string
      image?: string
      price: number
      rating?: number
      category?: string
    }
  }>(),
  { compact: false }
)

const productId = computed(
  () => String(props.product.id ?? props.product._id ?? '').trim(),
)

const FALLBACK = '/images/NonFictionIcon(1).svg'
const displayImage = computed(() => props.product.image || FALLBACK)
const categoryName = computed(() => categoryLabel(props.product.category))
const cartStore = useCartStore()

function onCoverError(e: Event) {
  const el = e.target as HTMLImageElement
  if (el && !el.src.endsWith(FALLBACK)) el.src = FALLBACK
}

const formattedPrice = computed(() =>
  new Intl.NumberFormat('fa-IR').format(props.product.price) + ' تومان'
)

const productUrl = computed(() => productPath(props.product))

const outOfStock = computed(() => (props.product.stock ?? 1) === 0)

const cartIcon = computed(() => {
  if (outOfStock.value) return 'mdi:cart-off'
  if (justAdded.value) return 'mdi:check'
  return 'mdi:cart-plus'
})

const cartLabel = computed(() => {
  if (outOfStock.value) return 'ناموجود'
  if (justAdded.value) return 'به سبد اضافه شد'
  return 'افزودن به سبد خرید'
})

function addProduct() {
  if (outOfStock.value || !productId.value) return
  cartStore.addToCart(
    {
      id: productId.value,
      name: props.product.title,
      price: props.product.price,
      image: props.product.image || FALLBACK,
      slug: props.product.slug,
    },
    1
  )
  justAdded.value = true
  notify.add({
    type: 'success',
    title: 'سبد خرید',
    message: `«${props.product.title}» به سبد خرید اضافه شد`,
  })
  setTimeout(() => {
    justAdded.value = false
  }, 2500)
}
</script>
