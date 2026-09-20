<script setup lang="ts">
import { onMounted, computed, ref } from 'vue'
import ProductGrid from '../components/ui/ProductGrid.vue'
import { useProductStore } from '../stores/productStore'
import { useCategoryStore } from '../stores/categories'

const store = useProductStore()
const categoryStore = useCategoryStore()
const searchQuery = ref('')
const selectedCategory = ref('')

const bestSellers = computed(() =>
  store.products.filter((p) => (p.rating ?? 0) >= 4.5)
)

const applyFilter = async () => {
  if (searchQuery.value) {
    await store.searchProducts(searchQuery.value)
  } else if (selectedCategory.value) {
    await store.fetchCategoryProducts(selectedCategory.value)
  } else {
    await store.fetchAllCategoriesProducts()
  }
}

onMounted(async () => {
  await categoryStore.fetchCategories()
  if (!store.products.length) {
    await store.fetchAllCategoriesProducts()
  }
})

definePageMeta({ layout: 'default' })
useSeoMeta({ title: 'پرفروش‌ها' })
</script>

<template>
  <section class="mx-auto max-w-[1280px] px-4 py-10 sm:px-8">
    <h1 class="text-center text-3xl font-black text-slate sm:text-4xl">پرفروش‌ها</h1>
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
        فیلتر
      </button>
    </div>

    <div v-if="store.isLoading" class="py-20 text-center text-slate/50">در حال بارگذاری کتاب‌ها...</div>
    <div v-else-if="store.error" class="py-20 text-center text-red-500">{{ store.error }}</div>
    <ProductGrid v-else-if="bestSellers.length" :products="bestSellers" />
    <p v-else class="py-16 text-center text-slate/50">کتاب پرفروشی پیدا نشد.</p>
  </section>
</template>
