<template>
  <DashboardBreadcrumb :items="['داشبورد', 'محصولات']" />

  <h1 class="m-5 font-semibold text-dash-text text-2xl">مدیریت محصولات</h1>

  <p v-if="activeSearch" class="mx-5 -mt-3 mb-4 text-sm text-dash-muted">
    نتیجه جستجو برای «{{ activeSearch }}»
  </p>

  <productsTable :products="products" :loading="isLoading" @add="onAddProduct" @delete="onDeleteProduct"
    @update="onUpdateProduct" />
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { useDashboardSearch } from '../../composables/useDashboardSearch'
import { useProductStore } from '../../stores/productStore'
import type { Product } from '~/types/types'
import productsTable from '../../components/dashboard/productsTable.vue'

definePageMeta({
  title: 'محصولات',
  layout: 'dashboard',
})

const store = useProductStore()
const route = useRoute()
const { query: searchQuery } = useDashboardSearch()

const activeSearch = ref('')
const products = computed(() => store.products)
const isLoading = computed(() => store.isLoading)

let debounceTimer: ReturnType<typeof setTimeout> | undefined

function runSearch(q: string) {
  const trimmed = q.trim()
  activeSearch.value = trimmed
  if (!trimmed) {
    return store.fetchAllCategoriesProducts()
  }
  return store.searchProducts(trimmed)
}

watch(
  searchQuery,
  (value) => {
    clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => {
      runSearch(value)
    }, 400)
  },
  { immediate: false }
)

watch(
  () => route.query.q,
  (q) => {
    const fromUrl = typeof q === 'string' ? q : ''
    if (fromUrl !== searchQuery.value) {
      searchQuery.value = fromUrl
    }
    runSearch(fromUrl)
  }
)

onMounted(() => {
  const fromUrl = route.query.q?.toString() ?? ''
  const initial = fromUrl || searchQuery.value
  if (initial) {
    searchQuery.value = initial
    runSearch(initial)
  } else {
    // بدون limit تا همه محصولات بیاید و pagination کار کند
    store.fetchAllCategoriesProducts()
  }
})

async function onAddProduct(product: {
  title: string
  price: number
  category: string
  quantity: number
}) {
  try {
    const created = await $fetch('/api/books', {
      method: 'POST',
      credentials: 'include',
      body: {
        title: product.title,
        price: product.price,
        category: product.category,
        stock: product.quantity,
      },
    })

    await store.fetchAllCategoriesProducts()
  } catch (error) {
    console.error('Create product failed:', error)
  }
}



function onDeleteProduct(id: string) {
  store.deleteProduct(id)
}

function onUpdateProduct(product: Product) {
  const list = store.products
  const idx = list.findIndex((p) => p.id === product.id || p._id === product._id)
  if (idx !== -1) list[idx] = { ...list[idx], ...product }
}
</script>
