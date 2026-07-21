<template>
  <DashboardBreadcrumb :items="['داشبورد', 'محصولات']" />

  <h1 class="m-5 font-semibold text-dash-text text-2xl">مدیریت محصولات</h1>

  <p
    v-if="activeSearch"
    class="mx-5 -mt-3 mb-4 text-sm text-dash-muted"
  >
    نتیجه جستجو برای «{{ activeSearch }}»
  </p>

  <productsTable
    :products="products"
    :loading="isLoading"
    @add="onAddProduct"
    @delete="onDeleteProduct"
  />
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { useDashboardSearch } from '~/composables/useDashboardSearch'
import { useProductStore } from '../../stores/productStore'
import productsTable from '../../components/dashboard/productsTable.vue'

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
    return store.fetchAllCategoriesProducts(10)
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
    store.fetchAllCategoriesProducts(10)
  }
})

function onAddProduct(product: Parameters<typeof store.addProduct>[0]) {
  store.addProduct(product)
}

function onDeleteProduct(id: string) {
  store.deleteProduct(id)
}

definePageMeta({
  title: 'محصولات',
  layout: 'dashboard',
})
</script>
