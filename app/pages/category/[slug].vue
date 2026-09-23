<template>
  <section class="mx-auto max-w-[1280px] px-4 py-6 sm:px-8 sm:py-10">
    <p class="text-xs font-bold text-slate/45">فروشگاه</p>
    <h1 class="mt-1 text-xl font-black text-slate sm:text-3xl">{{ categoryName || 'دسته‌بندی' }}</h1>
    <p v-if="!isLoading" class="mt-1 text-sm text-slate/50">{{ products.length.toLocaleString('fa-IR') }} کتاب</p>

    <nav
      class="-mx-4 mt-5 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 [&::-webkit-scrollbar]:hidden"
      aria-label="دسته‌بندی‌ها"
    >
      <NuxtLink
        v-for="cat in categoryStore.categories"
        :key="cat.slug"
        :to="`/category/${cat.slug}`"
        :class="[
          'inline-flex h-9 shrink-0 items-center rounded-full border px-3.5 text-xs font-semibold transition-colors',
          slug === cat.slug
            ? 'border-slate bg-slate text-white'
            : 'border-slate/10 bg-white text-slate/65 hover:border-slate/20 hover:text-slate',
        ]"
      >
        {{ cat.name }}
      </NuxtLink>
    </nav>

    <div v-if="isLoading" class="py-20 text-center text-slate/50">در حال بارگذاری...</div>
    <ProductGrid v-else-if="products.length" class="mt-6" :products="products" />
    <p v-else class="mt-10 py-12 text-center text-slate/50">هیچ کتابی برای این دسته پیدا نشد.</p>
  </section>
</template>

<script setup lang="ts">
import { computed, watch, watchEffect } from 'vue'
import { useCategoryStore } from '../../stores/categories'
import { useProductStore } from '../../stores/productStore'
import ProductGrid from '../../components/ui/ProductGrid.vue'

const route = useRoute()
const slug = computed(() => String(route.params.slug || ''))

const categoryStore = useCategoryStore()
const productStore = useProductStore()

await categoryStore.fetchCategories().catch(() => undefined)

watch(
  slug,
  async (value) => {
    if (!value) return
    const cat = categoryStore.categories.find((c) => c.slug === value)
    if (!cat) {
      await navigateTo('/new')
      return
    }
    await productStore.fetchCategoryProducts(cat.slug)
  },
  { immediate: true }
)

const categoryName = computed(() => {
  const c = categoryStore.categories.find((c) => c.slug === slug.value)
  return c?.name ?? ''
})

const products = computed(() => productStore.products)
const isLoading = computed(() => productStore.isLoading)

watchEffect(() => {
  useSeoMeta({
    title: categoryName.value ? `${categoryName.value} | Booklett` : 'دسته‌بندی | Booklett',
  })
})
</script>
