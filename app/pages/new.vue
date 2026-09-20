<script setup lang="ts">
import { ref } from 'vue'
import ProductGrid from '../components/ui/ProductGrid.vue'
import { useProductStore } from '../stores/productStore'
import { useCategoryStore } from '../stores/categories'

const store = useProductStore()
const categoryStore = useCategoryStore()
const route = useRoute()
const searchQuery = ref('')
const selectedCategory = ref('')

const applyFilter = async () => {
  if (searchQuery.value) {
    await store.searchProducts(searchQuery.value)
  } else if (selectedCategory.value) {
    await store.fetchCategoryProducts(selectedCategory.value)
  } else {
    await store.fetchAllCategoriesProducts()
  }
}

await categoryStore.fetchCategories().catch(() => undefined)

const q = typeof route.query.q === 'string' ? route.query.q.trim() : ''
if (q) {
  searchQuery.value = q
  await store.searchProducts(q)
} else {
  await store.fetchAllCategoriesProducts()
}

definePageMeta({ layout: 'default' })
useSeoMeta({ title: 'تازه‌ها' })
</script>

<template>
  <section class="mx-auto max-w-[1280px] px-4 py-10 sm:px-8">
    <h1 class="text-center text-3xl font-black text-slate sm:text-4xl">تازه‌ها</h1>
    <span class="mx-auto mb-8 mt-3 block h-1 w-12 rounded-full bg-lime" />

    <div class="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center">
      <input
        v-model="searchQuery"
        type="search"
        placeholder="جستجوی کتاب..."
        class="w-full rounded-2xl border border-slate/10 bg-white px-4 py-2.5 text-sm shadow-card focus:outline-none focus:ring-2 focus:ring-lime sm:flex-1"
      />
      <select
        v-model="selectedCategory"
        class="w-full rounded-2xl border border-slate/10 bg-white px-4 py-2.5 text-sm shadow-card focus:outline-none focus:ring-2 focus:ring-lime sm:w-48"
      >
        <option value="">همه دسته‌ها</option>
        <option v-for="cat in categoryStore.categories" :key="cat.slug" :value="cat.slug">
          {{ cat.name }}
        </option>
      </select>
      <button
        type="button"
        class="rounded-2xl bg-lime px-6 py-2.5 text-sm font-bold text-slate hover:opacity-90"
        @click="applyFilter"
      >
        اعمال فیلتر
      </button>
    </div>

    <div v-if="store.isLoading" class="py-20 text-center text-slate/50">در حال بارگذاری کتاب‌ها...</div>
    <div v-else-if="store.error" class="py-20 text-center text-red-500">{{ store.error }}</div>
    <ProductGrid v-else-if="store.products.length" :products="store.products" />
    <p v-else class="py-16 text-center text-slate/50">کتابی پیدا نشد.</p>
  </section>
</template>
