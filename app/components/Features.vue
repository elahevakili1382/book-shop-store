<template>
  <section>
    <SectionHeader
      eyebrow="Browse"
      title="خرید با دسته‌بندی"
      subtitle="دسته را انتخاب کن و کتاب‌های همان موضوع را ببین"
      link-to="/new"
      link-label="مشاهده همه"
      :show-nav="!!products.length && !isLoading"
      :nav-ready="swiperReady"
      @prev="slidePrev"
      @next="slideNext"
    />

    <ClientOnly>
      <motion.div
        v-if="categories.length"
        :initial="{ opacity: 0, y: 12 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.45 }"
        class="flex flex-wrap gap-2 mb-8"
      >
        <motion.button
          v-for="(cat, i) in categories"
          :key="cat.slug"
          type="button"
          :initial="{ opacity: 0, scale: 0.94 }"
          :animate="{ opacity: 1, scale: 1 }"
          :transition="{ duration: 0.3, delay: i * 0.03 }"
          :while-hover="{ y: -2 }"
          :while-tap="{ scale: 0.97 }"
          :class="[
            'inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold transition-colors',
            activeSlug === cat.slug
              ? 'bg-slate text-white border-slate shadow-card'
              : 'bg-white border-slate/10 text-slate/70 hover:border-slate/20 hover:text-slate',
          ]"
          @click="selectCategory(cat.slug)"
        >
          <NuxtImg
            :src="cat.icon"
            width="20"
            height="20"
            class="object-contain shrink-0 opacity-80"
            format="webp"
          />
          {{ cat.name }}
          <span
            :class="[
              'text-[10px] font-semibold px-1.5 py-0.5 rounded-full',
              activeSlug === cat.slug ? 'bg-white/15 text-white' : 'bg-slate/5 text-slate/50',
            ]"
          >
            {{ cat.items }}
          </span>
        </motion.button>
      </motion.div>
    </ClientOnly>

    <div v-if="isLoading" class="flex justify-center items-center h-48 rounded-3xl bg-white border border-slate/8">
      <span class="text-slate/50 font-medium">در حال بارگذاری کتاب‌ها...</span>
    </div>

    <ClientOnly>
      <div v-if="!isLoading && products.length">
        <p class="text-sm text-slate/50 mb-4">
          {{ activeCategoryName ? `کتاب‌های ${activeCategoryName}` : 'پیشنهادهای منتخب' }}
        </p>
        <Swiper
          :slides-per-view="'auto'"
          :space-between="16"
          grab-cursor
          @swiper="onSwiper"
          class="!pb-2 !overflow-visible"
        >
          <SwiperSlide
            v-for="product in products"
            :key="product.id ?? product._id"
            class="!w-[240px] sm:!w-[260px] flex-shrink-0"
          >
            <ProductCard :product="product" />
          </SwiperSlide>
        </Swiper>
      </div>

      <div
        v-else-if="!isLoading && !products.length"
        class="text-center py-12 rounded-3xl bg-white border border-dashed border-slate/15"
      >
        <p class="text-slate/50">کتابی در این دسته یافت نشد.</p>
      </div>
    </ClientOnly>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { motion } from 'motion-v'
import { useCategoryStore } from '../stores/categories'
import { useProductStore } from '../stores/productStore'
import { Swiper, SwiperSlide } from 'swiper/vue'
import type { Swiper as SwiperClass } from 'swiper'
import ProductCard from './ui/ProductCard.vue'
import SectionHeader from './ui/SectionHeader.vue'
import type { Category } from '../stores/categories'
import type { Product } from '../../types/types'
import 'swiper/css'

const categoryStore = useCategoryStore()
const productStore = useProductStore()

await categoryStore.fetchCategories()

const categories = computed((): Category[] => categoryStore.categories)
const activeSlug = ref(categories.value[0]?.slug ?? 'programming')
const localProducts = ref<Product[]>([])
const isLoading = ref(false)

const activeCategoryName = computed(() =>
  categories.value.find((c) => c.slug === activeSlug.value)?.name ?? ''
)

const products = computed(() => localProducts.value)

const swiperInstance = ref<SwiperClass | null>(null)
const swiperReady = ref(false)

const onSwiper = (swiper: SwiperClass) => {
  swiperInstance.value = swiper
  swiperReady.value = true
}

const slideNext = () => swiperInstance.value?.slideNext()
const slidePrev = () => swiperInstance.value?.slidePrev()

async function loadCategoryProducts(slug: string) {
  isLoading.value = true
  try {
    await productStore.fetchCategoryProducts(slug)
    localProducts.value = [...productStore.products]
  } finally {
    isLoading.value = false
  }
}

function selectCategory(slug: string) {
  activeSlug.value = slug
}

watch(
  activeSlug,
  (slug) => {
    if (slug) loadCategoryProducts(slug)
  },
  { immediate: true }
)
</script>

<style scoped>
.swiper-slide {
  display: flex;
  height: auto;
}
</style>
