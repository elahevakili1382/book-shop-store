<template>
  <section class="rounded-[2rem] bg-white border border-slate/8 p-6 sm:p-8 lg:p-10 shadow-card overflow-x-hidden">
    <SectionHeader
      eyebrow="Trending"
      title="پرفروش‌ترین‌ها"
      subtitle="بر اساس دسته‌بندی انتخاب کن"
      link-to="/bestseller"
      link-label="مشاهده پرفروش‌ها"
      :show-nav="!!products.length && !isLoading"
      :nav-ready="swiperReady"
      @prev="slidePrev"
      @next="slideNext"
    />

    <div class="flex flex-col lg:flex-row gap-6 lg:gap-8">
      <aside class="lg:w-56 shrink-0">
        <p class="text-xs font-bold tracking-wide text-slate/45 mb-3">دسته‌بندی</p>
        <ul class="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-1 lg:pb-0">
          <li v-for="cat in categories" :key="cat.slug">
            <button
              type="button"
              :class="[
                'whitespace-nowrap w-full text-right px-4 py-2.5 rounded-xl text-sm font-semibold border transition-colors',
                selectedSlug === cat.slug
                  ? 'bg-slate text-white border-slate'
                  : 'bg-cream border-slate/10 text-slate/65 hover:border-slate/20 hover:text-slate',
              ]"
              @click="selectCategory(cat.slug)"
            >
              {{ cat.name }}
            </button>
          </li>
        </ul>
      </aside>

      <div class="flex-1 min-w-0">
        <div v-if="isLoading" class="flex justify-center items-center h-64">
          <span class="text-slate/50">در حال بارگذاری...</span>
        </div>

        <ClientOnly v-else>
          <div class="overflow-x-hidden -mx-6 px-6 sm:-mx-8 sm:px-8">
            <Swiper
              v-show="products.length"
              grab-cursor
              class="peek-swiper"
              slides-per-view="auto"
              :space-between="12"
              @swiper="onSwiper"
              :breakpoints="{
                640: { slidesPerView: 1.5, spaceBetween: 12 },
                768: { slidesPerView: 2.15, spaceBetween: 16 },
                1024: { slidesPerView: 3, spaceBetween: 16 },
                1280: { slidesPerView: 3.5, spaceBetween: 16 },
              }"
            >
              <SwiperSlide
                v-for="product in products"
                :key="product._key"
                class="peek-slide h-auto"
              >
                <ProductCard :product="product" />
              </SwiperSlide>
            </Swiper>
          </div>
        </ClientOnly>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { useProductStore } from '../stores/productStore'
import { useCategoryStore } from '../stores/categories'
import ProductCard from './ui/ProductCard.vue'
import SectionHeader from './ui/SectionHeader.vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import type SwiperClass from 'swiper'
import 'swiper/css'

const store = useProductStore()
const categoryStore = useCategoryStore()

const selectedSlug = ref('')
const products = ref<any[]>([])
const isLoading = ref(true)

const categories = computed(() => categoryStore.categories)

const swiperInstance = ref<SwiperClass | null>(null)
const swiperReady = ref(false)
const onSwiper = (swiper: SwiperClass) => {
  swiperInstance.value = swiper
  swiperReady.value = true
}
const slideNext = () => swiperInstance.value?.slideNext()
const slidePrev = () => swiperInstance.value?.slidePrev()

async function fetchProducts(slug: string) {
  isLoading.value = true
  try {
    await store.fetchCategoryProducts(slug)
    products.value = store.products.map((p) => ({ ...p, _key: p.id + slug }))
    await nextTick()
    swiperInstance.value?.update()
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  await categoryStore.fetchCategories()
  const first = categoryStore.categories[0]
  if (first) {
    selectedSlug.value = first.slug
    await fetchProducts(first.slug)
  } else {
    isLoading.value = false
  }
})

function selectCategory(slug: string) {
  selectedSlug.value = slug
  fetchProducts(slug)
}
</script>

<style scoped>
.peek-swiper {
  overflow: visible !important;
}
.peek-slide {
  width: 220px;
  flex-shrink: 0;
  display: flex;
  height: auto;
}
@media (min-width: 640px) {
  .peek-slide {
    width: auto;
  }
}
</style>
