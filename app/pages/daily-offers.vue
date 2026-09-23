<script setup lang="ts">
import { onMounted, ref } from 'vue'
import ProductGrid from '../components/ui/ProductGrid.vue'
import { useProductStore } from '../stores/productStore'
import { useCategoryStore } from '../stores/categories'

const store = useProductStore()
const categoryStore = useCategoryStore()
const searchQuery = ref('')
const selectedCategory = ref('')

async function applyFilter() {
  if (searchQuery.value) {
    await store.searchProducts(searchQuery.value)
  } else if (selectedCategory.value) {
    await store.fetchCategoryProducts(selectedCategory.value)
  } else {
    await store.fetchAllCategoriesProducts()
  }
}

function pickCategory(slug: string) {
  selectedCategory.value = slug
  searchQuery.value = ''
  applyFilter()
}

function chipClass(active: boolean) {
  return [
    'inline-flex h-9 shrink-0 items-center rounded-full border px-3.5 text-xs font-semibold transition-colors',
    active
      ? 'border-slate bg-slate text-white'
      : 'border-slate/10 bg-white text-slate/65 hover:border-slate/20 hover:text-slate',
  ]
}

onMounted(async () => {
  await categoryStore.fetchCategories()
  if (!store.products.length) {
    await store.fetchAllCategoriesProducts()
  }
})

definePageMeta({ layout: 'default' })
useSeoMeta({ title: 'پیشنهاد روز | Booklett' })
</script>

<template>
  <section class="mx-auto max-w-[1280px] px-4 py-6 sm:px-8 sm:py-10">
    <h1 class="text-xl font-black text-slate sm:text-3xl">پیشنهادهای روز</h1>
    <p class="mt-1 text-sm text-slate/50">{{ store.products.length.toLocaleString('fa-IR') }} کتاب</p>

    <input
      v-model="searchQuery"
      type="search"
      placeholder="جستجوی کتاب..."
      class="mt-4 w-full rounded-2xl border border-slate/10 bg-white px-4 py-2.5 text-sm shadow-card focus:outline-none focus:ring-2 focus:ring-lime"
      @keyup.enter="applyFilter"
    />

    <nav
      class="-mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 [&::-webkit-scrollbar]:hidden"
      aria-label="فیلتر دسته"
    >
      <button type="button" :class="chipClass(!selectedCategory)" @click="pickCategory('')">
        همه
      </button>
      <button
        v-for="cat in categoryStore.categories"
        :key="cat.slug"
        type="button"
        :class="chipClass(selectedCategory === cat.slug)"
        @click="pickCategory(cat.slug)"
      >
        {{ cat.name }}
      </button>
    </nav>

    <div v-if="store.isLoading" class="py-20 text-center text-slate/50">در حال بارگذاری محصولات...</div>
    <div v-else-if="store.error" class="py-20 text-center text-red-500">{{ store.error }}</div>
    <ProductGrid v-else-if="store.products.length" class="mt-6" :products="store.products" />
    <p v-else class="mt-10 py-12 text-center text-slate/50">پیشنهادی پیدا نشد.</p>
  </section>
</template>
