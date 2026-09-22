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

useSeoMeta({
  title: 'محصولات',
})

const store = useProductStore()
const route = useRoute()
const { query: searchQuery } = useDashboardSearch()

const activeSearch = ref('')
const products = computed(() => store.products)
const isLoading = computed(() => store.isLoading)

if (!store.products.length) {
  store.isLoading = true
}

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
  description: string
  features: string[]
  author?: string
  publisher?: string
  pages?: number
}) {
  try {
    await $fetch('/api/books', {
      method: 'POST',
      credentials: 'include',
      body: {
        title: product.title,
        price: product.price,
        category: product.category,
        stock: product.quantity,
        description: product.description,
        features: product.features,
        author: product.author,
        publisher: product.publisher,
        pages: product.pages,
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

async function onUpdateProduct(product: Product) {
  const id = product._id || product.id
  if (!id) return
  try {
    await $fetch(`/api/books/${id}`, {
      method: 'PUT',
      credentials: 'include',
      body: {
        title: product.title,
        price: product.price,
        category: product.category,
        stock: product.quantity ?? product.stock,
        description: product.description,
        features: product.features || [],
        author: product.author,
        publisher: product.publisher,
        pages: product.pages,
      },
    })
    await store.fetchAllCategoriesProducts()
  } catch (error) {
    console.error('Update product failed:', error)
  }
}
</script>
