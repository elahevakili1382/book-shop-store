<template>
  <main class="product-page min-h-screen pb-36 lg:pb-16">
    <div class="mx-auto max-w-[1280px] px-4 pt-3 sm:px-8 sm:pt-6 lg:pt-8">
      <nav class="mb-6 hidden flex-wrap items-center gap-1.5 text-xs text-slate/50 sm:flex lg:mb-8">
        <NuxtLink to="/" class="hover:text-slate transition-colors">خانه</NuxtLink>
        <AppIcon icon="mdi:chevron-left" class="w-3.5 h-3.5 shrink-0" />
        <NuxtLink
          v-if="categorySlug"
          :to="`/category/${categorySlug}`"
          class="hover:text-slate transition-colors"
        >
          {{ categoryLabel }}
        </NuxtLink>
        <NuxtLink v-else to="/new" class="hover:text-slate transition-colors">فروشگاه</NuxtLink>
        <AppIcon icon="mdi:chevron-left" class="w-3.5 h-3.5 shrink-0" />
        <span v-if="product" class="text-slate/70 truncate max-w-[220px]">{{ product.title }}</span>
      </nav>

      <!-- Loading -->
      <div v-if="pending" class="flex justify-center items-center h-64 rounded-3xl bg-white border border-slate/8">
        <span class="text-slate/50 animate-pulse">در حال بارگذاری...</span>
      </div>

      <!-- Error -->
      <div
        v-else-if="fetchError"
        class="flex flex-col justify-center items-center h-64 text-center px-4 rounded-3xl bg-white border border-slate/8"
      >
        <AppIcon icon="mdi:book-remove-outline" class="w-12 h-12 text-slate/30 mb-4" />
        <p class="text-lg font-bold text-slate mb-2">محصول یافت نشد</p>
        <p class="text-sm text-slate/55 mb-6">{{ fetchError }}</p>
        <NuxtLink
          to="/"
          class="px-6 py-3 rounded-2xl bg-slate text-white font-bold text-sm hover:opacity-90 transition-opacity"
        >
          بازگشت به صفحه اصلی
        </NuxtLink>
      </div>

      <!-- Product -->
      <template v-else-if="product">
        <ClientOnly>
          <motion.div
            :initial="{ opacity: 0, y: 20 }"
            :animate="{ opacity: 1, y: 0 }"
            :transition="{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }"
            class="grid lg:grid-cols-12 gap-8 lg:gap-10 items-start"
          >
            <!-- Cover gallery (RTL: right column) -->
            <motion.div
              :initial="{ opacity: 0, scale: 0.96 }"
              :animate="{ opacity: 1, scale: 1 }"
              :transition="{ duration: 0.55, delay: 0.08 }"
              class="lg:col-span-5 order-1"
            >
              <div class="-mx-4 overflow-hidden bg-white sm:mx-0 sm:rounded-[1.75rem] sm:border sm:border-slate/8 sm:p-4 sm:shadow-card lg:p-5">
                <div class="relative overflow-hidden bg-cream/60 sm:rounded-2xl">
                  <img
                    :src="activeImage"
                    :alt="product.title"
                    width="420"
                    height="560"
                    class="w-full aspect-[4/5] object-cover"
                  />
                  <span
                    v-if="categoryLabel"
                    class="absolute top-4 right-4 hidden rounded-full bg-slate/90 px-3 py-1 text-xs font-bold text-white sm:inline-flex"
                  >
                    {{ categoryLabel }}
                  </span>
                  <div
                    v-if="galleryImages.length > 1"
                    class="absolute inset-x-0 bottom-3 flex items-center justify-center gap-1.5 sm:hidden"
                  >
                    <button
                      v-for="(img, idx) in galleryImages"
                      :key="idx"
                      type="button"
                      :aria-label="`تصویر ${idx + 1}`"
                      :class="[
                        'h-1.5 rounded-full transition-all',
                        activeImage === img ? 'w-4 bg-slate' : 'w-1.5 bg-slate/30',
                      ]"
                      @click="activeImage = img"
                    />
                  </div>
                </div>

                <div v-if="galleryImages.length > 1" class="mt-3 hidden gap-2 overflow-x-auto pb-1 sm:flex">
                  <button
                    v-for="(img, idx) in galleryImages"
                    :key="idx"
                    type="button"
                    :class="[
                      'h-20 w-16 shrink-0 overflow-hidden rounded-xl border-2 transition-colors',
                      activeImage === img ? 'border-lime' : 'border-transparent hover:border-slate/20',
                    ]"
                    @click="activeImage = img"
                  >
                    <img :src="img" :alt="`${product.title} ${idx + 1}`" class="h-full w-full object-cover" />
                  </button>
                </div>
              </div>
            </motion.div>

            <!-- Details (RTL: left column) -->
            <div class="lg:col-span-7 order-2">
              <div class="lg:grid lg:grid-cols-5 lg:gap-8 items-start">
                <!-- Main info -->
                <div class="space-y-5 pb-8 lg:col-span-3 lg:pb-0">
                  <div>
                    <div class="flex items-start gap-2">
                      <div class="min-w-0 flex-1">
                        <h1 class="text-xl font-black leading-tight text-slate sm:text-3xl">
                          {{ product.title }}
                        </h1>
                        <p v-if="displayTitleEn" class="mt-1.5 w-full text-right text-sm font-medium text-slate/45 sm:text-base" dir="ltr">
                          {{ displayTitleEn }}
                        </p>
                        <p class="mt-2 text-lg font-black text-slate sm:hidden">{{ formattedPrice }}</p>
                      </div>
                      <div class="flex shrink-0 items-center gap-1">
                        <button
                          type="button"
                          :aria-label="isWishlisted ? 'حذف از علاقه‌مندی‌ها' : 'افزودن به علاقه‌مندی‌ها'"
                          class="inline-flex h-10 w-10 items-center justify-center text-slate/55 transition-colors hover:text-red-500"
                          @click="toggleWishlist"
                        >
                          <AppIcon :icon="isWishlisted ? 'mdi:heart' : 'mdi:heart-outline'" class="h-6 w-6" :class="isWishlisted ? 'text-red-500' : ''" />
                        </button>
                        <ProductShareMenu v-if="product.title" :title="product.title" />
                      </div>
                    </div>
                  </div>

                  <!-- Publisher + meta links -->
                  <div class="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate/60">
                    <span v-if="product.publisher" class="inline-flex items-center gap-1.5">
                      <span class="text-slate/40">ناشر:</span>
                      <span class="font-semibold text-slate hover:text-slate/80 transition-colors">{{ product.publisher }}</span>
                    </span>
                    <span v-if="product.author" class="inline-flex items-center gap-1.5">
                      <span class="text-slate/40">نویسنده:</span>
                      <span class="font-semibold text-slate">{{ product.author }}</span>
                    </span>
                    <span v-if="product.translator" class="inline-flex items-center gap-1.5">
                      <span class="text-slate/40">مترجم:</span>
                      <span class="font-semibold text-slate">{{ product.translator }}</span>
                    </span>
                  </div>

                  <!-- Rating + actions -->
                  <div class="flex flex-wrap items-center gap-3">
                    <template v-if="displayRating">
                      <div class="inline-flex items-center gap-1">
                        <AppIcon
                          v-for="star in 5"
                          :key="star"
                          :icon="starIcon(star, displayRating)"
                          :class="[
                            'w-5 h-5',
                            star <= Math.round(displayRating) ? 'text-lime' : 'text-slate/15',
                          ]"
                        />
                      </div>
                      <span class="text-sm font-bold text-slate">{{ displayRating.toLocaleString('fa-IR') }}</span>
                      <span class="text-xs text-slate/45">از ۵</span>
                      <a
                        v-if="displayReviewCount"
                        href="#reviews"
                        class="text-xs text-slate/45 hover:text-slate underline-offset-2 hover:underline transition-colors"
                      >
                        ({{ displayReviewCount.toLocaleString('fa-IR') }} نظر)
                      </a>
                    </template>
                    <span
                      :class="[
                        'px-2.5 py-1 rounded-full text-xs font-bold',
                        inStock ? 'bg-lime/30 text-slate' : 'bg-red-50 text-red-600',
                      ]"
                    >
                      {{ inStock ? 'موجود' : 'ناموجود' }}
                    </span>
                  </div>

                  <div v-if="featureItems.length" class="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    <div
                      v-for="item in featureItems"
                      :key="item.label"
                      class="rounded-xl bg-white border border-slate/8 px-3 py-2.5 text-center"
                    >
                      <p class="text-[10px] text-slate/40 mb-0.5">{{ item.label }}</p>
                      <p class="text-xs font-bold text-slate truncate">{{ item.value }}</p>
                    </div>
                  </div>

                 
                  <div v-if="specRows.length" class="rounded-2xl bg-white border border-slate/8 overflow-hidden">
                    <div class="px-4 sm:px-5 py-3 border-b border-slate/8 bg-cream/50">
                      <h2 class="text-sm font-bold text-slate">مشخصات کتاب</h2>
                    </div>
                    <div
                      v-for="(row, idx) in specRows"
                      :key="row.label"
                      :class="[
                        'flex items-center justify-between gap-4 px-4 sm:px-5 py-3 text-sm border-b border-slate/8 last:border-b-0',
                        idx % 2 === 0 ? 'bg-white' : 'bg-cream/30',
                      ]"
                    >
                      <span class="text-slate/45 font-medium shrink-0">{{ row.label }}</span>
                      <span class="text-slate font-semibold text-left truncate" dir="ltr">{{ row.value }}</span>
                    </div>
                  </div>
                </div>

                <!-- Sticky sidebar: price + CTA (Digikala-style) -->
                <div class="hidden lg:block lg:col-span-2">
                  <div class="sticky top-24 rounded-2xl bg-white border border-slate/8 p-5 shadow-card space-y-4">
                    <div>
                      <p class="text-xs font-bold text-slate/45 mb-1">قیمت</p>
                      <p class="text-2xl font-black text-slate">{{ formattedPrice }}</p>
                    </div>

                    <div class="flex items-center gap-2 rounded-2xl bg-cream border border-slate/10 p-1 w-full">
                      <button
                        type="button"
                        aria-label="کاهش تعداد"
                        class="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-white transition-colors text-slate disabled:opacity-40"
                        :disabled="quantity <= 1"
                        @click="decreaseQuantity"
                      >
                        <AppIcon icon="mdi:minus" class="w-4 h-4" />
                      </button>
                      <span class="flex-1 text-center font-bold text-slate">{{ quantity }}</span>
                      <button
                        type="button"
                        aria-label="افزایش تعداد"
                        class="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-white transition-colors text-slate disabled:opacity-40"
                        :disabled="!canIncrease"
                        @click="increaseQuantity"
                      >
                        <AppIcon icon="mdi:plus" class="w-4 h-4" />
                      </button>
                    </div>

                    <motion.button
                      type="button"
                      :disabled="!inStock"
                      :while-hover="inStock ? { scale: 1.02 } : {}"
                      :while-tap="inStock ? { scale: 0.98 } : {}"
                      class="w-full py-3.5 px-6 rounded-2xl bg-slate text-white font-bold text-sm
                             flex items-center justify-center gap-2 hover:bg-lime hover:text-slate transition-colors
                             disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-slate disabled:hover:text-white"
                      @click="justAdded ? goToCart() : addToCart"
                    >
                      <AppIcon :icon="justAdded ? 'mdi:arrow-left' : 'mdi:cart-plus'" class="w-5 h-5" />
                      {{ justAdded ? 'رفتن به سبد' : inStock ? 'افزودن به سبد' : 'ناموجود' }}
                    </motion.button>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>

          <template #fallback>
            <div class="grid lg:grid-cols-12 gap-8 animate-pulse">
              <div class="lg:col-span-5 aspect-[4/5] rounded-3xl bg-white/80" />
              <div class="lg:col-span-7 space-y-4">
                <div class="h-8 bg-white/80 rounded-xl w-3/4" />
                <div class="h-24 bg-white/80 rounded-xl" />
              </div>
            </div>
          </template>
        </ClientOnly>

        <!-- Description -->
        <section v-if="descriptionText" class="mt-12 lg:mt-16">
          <div class="rounded-2xl bg-white border border-slate/8 p-5 sm:p-6 lg:p-8">
            <h2 class="text-base font-bold text-slate mb-4 pb-3 border-b border-slate/8">درباره این کتاب</h2>
            <p class="text-sm sm:text-base text-slate/65 leading-relaxed">{{ descriptionText }}</p>
          </div>
        </section>

        <section v-if="productFeatures.length" class="mt-6">
          <div class="rounded-2xl border border-slate/8 bg-white p-5 sm:p-6 lg:p-8">
            <h2 class="mb-4 border-b border-slate/8 pb-3 text-base font-bold text-slate">ویژگی‌ها</h2>
            <ul class="space-y-2 text-sm text-slate/70">
              <li v-for="item in productFeatures" :key="item" class="flex gap-2">
                <span class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate" />
                <span>{{ item }}</span>
              </li>
            </ul>
          </div>
        </section>

        <!-- Reviews (MongoDB) -->
        <ProductReviews
          v-if="product.slug"
          :reviews="reviewsSummary?.reviews ?? []"
          :total="displayReviewCount"
          :average-rating="displayRating"
          :pending="reviewsPending"
        />

        <!-- Related books -->
        <section v-if="relatedProducts?.length" class="mt-12 lg:mt-16">
          <SectionHeader
            eyebrow="پیشنهاد"
            title="کتاب‌های مرتبط"
            subtitle="شاید این‌ها هم دوست داشته باشی"
            :show-nav="false"
          />
          <ClientOnly>
            <div class="mt-6 grid grid-cols-2 gap-x-3 gap-y-5 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
              <motion.div
                v-for="(item, i) in relatedProducts"
                :key="item._id"
                :initial="{ opacity: 0, y: 16 }"
                :while-in-view="{ opacity: 1, y: 0 }"
                :viewport="{ once: true, amount: 0.2 }"
                :transition="{ duration: 0.4, delay: i * 0.06 }"
              >
                <ProductCard compact :product="item" />
              </motion.div>
            </div>
          </ClientOnly>
        </section>
      </template>
    </div>

    <!-- Sticky mobile bar -->
    <div
      v-if="product && !pending && !fetchError"
      class="fixed inset-x-0 bottom-[4.75rem] z-30 border-t border-slate/10 bg-white px-4 py-3 lg:hidden"
    >
      <div class="mx-auto flex max-w-[1280px] items-center gap-3">
        <div class="flex shrink-0 items-center gap-2 rounded-2xl border border-slate/10 bg-cream p-1">
          <button
            type="button"
            aria-label="کاهش تعداد"
            class="w-8 h-8 flex items-center justify-center rounded-xl text-slate disabled:opacity-40"
            :disabled="quantity <= 1"
            @click="decreaseQuantity"
          >
            <AppIcon icon="mdi:minus" class="w-4 h-4" />
          </button>
          <span class="w-6 text-center text-sm font-bold text-slate">{{ quantity }}</span>
          <button
            type="button"
            aria-label="افزایش تعداد"
            class="w-8 h-8 flex items-center justify-center rounded-xl text-slate disabled:opacity-40"
            :disabled="!canIncrease"
            @click="increaseQuantity"
          >
            <AppIcon icon="mdi:plus" class="w-4 h-4" />
          </button>
        </div>
        <button
          type="button"
          :disabled="!inStock"
          class="flex-1 py-3 rounded-2xl bg-slate text-white font-bold text-sm flex items-center justify-center gap-2
                 hover:bg-lime hover:text-slate transition-colors
                 disabled:opacity-50 disabled:cursor-not-allowed"
          @click="justAdded ? goToCart() : addToCart"
        >
          <AppIcon :icon="justAdded ? 'mdi:arrow-left' : 'mdi:cart-plus'" class="w-5 h-5" />
          {{ justAdded ? 'رفتن به سبد' : inStock ? 'افزودن به سبد' : 'ناموجود' }}
        </button>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { motion } from 'motion-v'
import { useCartStore } from '../../stores/cart'
import { useWishlistStore } from '../../stores/wishlist'
import type { ProductDetail } from '../../stores/productStore'
import { mapBookToProduct } from '../../stores/productStore'
import type { Product } from '~/types/types'
import ProductCard from '../../components/ui/ProductCard.vue'
import SectionHeader from '../../components/ui/SectionHeader.vue'
import ProductReviews from '../../components/product/ProductReviews.vue'
import ProductShareMenu from '../../components/product/ProductShareMenu.vue'
import { useCategoryStore } from '../../stores/categories'
import type { ReviewsResponse } from '~/types/types'

const cartStore = useCartStore()
const wishlist = useWishlistStore()
const categoryStore = useCategoryStore()
const quantity = ref(1)
const justAdded = ref(false)
const toast = useToast()

const route = useRoute()
const slug = computed(() => route.params.slug as string)

await categoryStore.fetchCategories()

const {
  data: product,
  error: productError,
  pending,
} = await useAsyncData<ProductDetail | null>(
  () => `product-${slug.value}`,
  async () => {
    try {
      const key = String(slug.value || '').trim()
      if (!key) return null
      return await $fetch<ProductDetail>(`/api/books/${encodeURIComponent(key)}`)
    } catch {
      return null
    }
  },
  { watch: [slug] }
)

const { data: relatedProducts } = await useAsyncData<Product[]>(
  () => (product.value ? `related-${product.value._id}` : 'related-empty'),
  async () => {
    if (!product.value) return []
    const data = await $fetch<Record<string, unknown>[]>('/api/books', {
      query: {
        category: product.value.category,
        exclude: product.value._id,
        limit: 4,
      },
    })
    return Array.isArray(data) ? data.map(mapBookToProduct) : []
  },
  { watch: [() => product.value?._id] }
)

const { data: reviewsSummary, pending: reviewsPending } = await useAsyncData<ReviewsResponse | null>(
  () => (product.value?.slug ? `reviews-summary-${product.value.slug}` : 'reviews-summary-empty'),
  async () => {
    if (!product.value?.slug) return null
    try {
      return await $fetch<ReviewsResponse>(`/api/books/${product.value.slug}/reviews`)
    } catch {
      return null
    }
  },
  { watch: [() => product.value?.slug] }
)

const displayRating = computed(() => {
  if (reviewsSummary.value?.averageRating) return reviewsSummary.value.averageRating
  return product.value?.rating ?? 0
})

const displayReviewCount = computed(() => {
  if (reviewsSummary.value?.total) return reviewsSummary.value.total
  return product.value?.reviewCount ?? 0
})

const isWishlisted = computed(() => {
  const id = product.value?._id ?? product.value?.id
  return wishlist.has(id)
})

function toggleWishlist() {
  const id = product.value?._id ?? product.value?.id
  if (!id) return
  const added = wishlist.toggle(id)
  if (added) {
    toast.success({ message: 'به علاقه‌مندی‌ها اضافه شد', position: 'topRight', timeout: 2000 })
  } else {
    toast.info({ message: 'از علاقه‌مندی‌ها حذف شد', position: 'topRight', timeout: 2000 })
  }
}

const fetchError = computed(() => {
  if (productError.value) return 'خطا در بارگذاری محصول'
  if (!pending.value && !product.value) return 'محصول مورد نظر یافت نشد'
  return null
})

const activeImage = ref('')
const galleryImages = computed(() => {
  if (!product.value) return []
  const main = product.value.image || '/images/default-book.jpg'
  return [main]
})

watch(
  product,
  (p) => {
    if (p) {
      quantity.value = 1
      activeImage.value = p.image || '/images/default-book.jpg'
    }
  },
  { immediate: true }
)

watchEffect(() => {
  if (product.value) {
    useSeoMeta({
      title: `${product.value.title} | Booklett`,
      description:
        product.value.description ||
        `خرید ${product.value.title} از فروشگاه Booklett`,
      ogTitle: `${product.value.title} | Booklett`,
      ogDescription: product.value.description,
      ogImage: product.value.image,
    })
  }
})

const categorySlug = computed(() => product.value?.category ?? '')

const categoryLabel = computed(() => {
  const cat = categoryStore.categories.find((c) => c.slug === product.value?.category)
  return cat?.name ?? product.value?.category ?? ''
})

const displayTitleEn = computed(() => {
  if (!product.value) return ''
  if (product.value.titleEn && product.value.titleEn !== product.value.title) {
    return product.value.titleEn
  }
  return ''
})

const formattedPrice = computed(() =>
  product.value ? new Intl.NumberFormat('fa-IR').format(product.value.price) + ' تومان' : ''
)

const maxStock = computed(() => product.value?.stock ?? 0)
const inStock = computed(() => maxStock.value > 0)
const canIncrease = computed(() => inStock.value && quantity.value < maxStock.value)

const descriptionText = computed(() => product.value?.description || '')
const productFeatures = computed(() => product.value?.features?.filter(Boolean) ?? [])

const specRows = computed(() => {
  if (!product.value) return []
  const p = product.value
  const rows: { label: string; value: string }[] = []
  if (p.publishedYear) rows.push({ label: 'سال انتشار', value: String(p.publishedYear) })
  if (p.format) rows.push({ label: 'نوع جلد', value: p.format })
  if (p.pages) rows.push({ label: 'تعداد صفحات', value: String(p.pages) })
  if (p.isbn) rows.push({ label: 'شابک (ISBN)', value: p.isbn })
  if (p.publisher) rows.push({ label: 'ناشر', value: p.publisher })
  if (p.author) rows.push({ label: 'نویسنده', value: p.author })
  if (p.translator) rows.push({ label: 'مترجم', value: p.translator })
  return rows
})

const featureItems = computed(() => {
  if (!product.value) return []
  const p = product.value
  const items: { label: string; value: string }[] = []
  if (p.format) items.push({ label: 'نوع جلد', value: p.format })
  if (p.pages) items.push({ label: 'صفحات', value: String(p.pages) })
  if (p.publishedYear) items.push({ label: 'سال', value: String(p.publishedYear) })
  if (p.publisher) items.push({ label: 'ناشر', value: p.publisher })
  return items.slice(0, 6)
})

function starIcon(star: number, rating: number): string {
  if (star <= Math.floor(rating)) return 'mdi:star'
  if (star - rating <= 0.5) return 'mdi:star-half-full'
  return 'mdi:star-outline'
}

const increaseQuantity = () => {
  if (canIncrease.value) quantity.value++
}
const decreaseQuantity = () => {
  if (quantity.value > 1) quantity.value--
}

const addToCart = () => {
  if (!product.value || !inStock.value) return

  cartStore.addToCart(
    {
      id: product.value.id ?? product.value._id,
      name: product.value.title,
      price: product.value.price,
      image: product.value.image || '/images/default-book.jpg',
      slug: product.value.slug,
    },
    quantity.value
  )

  toast.success({
    message: `«${product.value.title}» به سبد خرید اضافه شد`,
    position: 'topRight',
    timeout: 2400,
  })

  justAdded.value = true
  setTimeout(() => {
    justAdded.value = false
  }, 4000)
}

function goToCart() {
  navigateTo('/cart')
}
</script>

<style scoped>
.product-page {
  direction: rtl;
}

.ltr-inline {
  unicode-bidi: isolate;
}

.safe-bottom {
  padding-bottom: max(0.75rem, env(safe-area-inset-bottom));
}
</style>
