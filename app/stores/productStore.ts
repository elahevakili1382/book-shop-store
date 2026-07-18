// stores/product.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Product } from '~/types/types'

export interface ProductDetail extends Product {
  summary?: string
  language?: string
  publishDate?: string
  subjects?: string[]
  firstPublish?: string
}

/* ---------- Config ---------- */
const SEARCH_DEBOUNCE_MS = 400
const CACHE_TTL_MS = 1000 * 60 * 5 // 5 minutes

/* ---------- Helpers ---------- */
function now() { return Date.now() }
type CacheEntry<T> = {
  value: T
  expiresAt: number
}

function setCache<T>(
  map: Map<string, CacheEntry<T>>,
  key: string,
  value: T,
  ttl = CACHE_TTL_MS
) {
  map.set(key, { value, expiresAt: now() + ttl })
}

function getCache<T>(
  map: Map<string, CacheEntry<T>>,
  key: string
): T | null {
  const e = map.get(key)
  if (!e) return null
  if (e.expiresAt < now()) {
    map.delete(key)
    return null
  }
  return e.value
}

export function mapBookToProduct(book: Record<string, unknown>): Product {
  return {
    _id: String(book._id ?? ''),
    id: String(book.id ?? book._id ?? ''),
    title: (book.title as string) ?? 'بدون عنوان',
    description: (book.description as string) ?? '',
    price: (book.price as number) ?? 0,
    image: (book.image as string) ?? '/images/default-book.jpg',
    category: (book.category as string) ?? 'نامشخص',
    stock: (book.stock as number) ?? 0,
    quantity: (book.quantity as number) ?? 0,
    slug: book.slug as string | undefined,
    author: book.author as string | undefined,
    rating: (book.rating as number) ?? 0,
    pages: book.pages as number | undefined,
    publisher: book.publisher as string | undefined,
    format: book.format as string | undefined,
    publishedYear: book.publishedYear as number | undefined,
    translator: book.translator as string | undefined,
  }
}

/* ---------- Store ---------- */
export const useProductStore = defineStore('productStore', () => {
  const products = ref<Product[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const detailCache = new Map<string, CacheEntry<ProductDetail>>()

  const productsMapById = computed(() => {
    const m = new Map<string, Product>()
    for (const p of products.value) m.set(p._id, p)
    return m
  })

  async function fetchCategoryProducts(category: string) {
    isLoading.value = true
    error.value = null

    try {
      const data = await $fetch<Record<string, unknown>[]>('/api/books', {
        query: { category },
      })

      const list = Array.isArray(data) ? data.map(mapBookToProduct) : []
      products.value = list
      return list
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'خطا در دریافت کتاب‌ها'
      return []
    } finally {
      isLoading.value = false
    }
  }

  async function fetchAllCategoriesProducts(limit?: number) {
    isLoading.value = true
    error.value = null

    try {
      const query = typeof limit === 'number' && limit > 0 ? { limit } : undefined
      const data = await $fetch<Record<string, unknown>[]>('/api/books', { query })

      const list = Array.isArray(data) ? data.map(mapBookToProduct) : []
      products.value = list
      return list
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'خطا در دریافت کتاب‌ها'
      return []
    } finally {
      isLoading.value = false
    }
  }

  async function searchProducts(query: string) {
    isLoading.value = true
    error.value = null

    try {
      const data = await $fetch<Record<string, unknown>[]>('/api/books')

      const list = Array.isArray(data)
        ? data
            .filter((b) =>
              (b.title as string)?.toLowerCase().includes(query.toLowerCase())
            )
            .map(mapBookToProduct)
        : []

      products.value = list
      return list
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'خطا در جستجو'
      return []
    } finally {
      isLoading.value = false
    }
  }

  async function fetchProductBySlug(slug: string): Promise<ProductDetail | null> {
    isLoading.value = true
    error.value = null

    try {
      const cached = getCache(detailCache, slug)
      if (cached) return cached

      const product = await $fetch<ProductDetail>(`/api/books/${slug}`)
      setCache(detailCache, slug, product)
      return product
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'خطا در دریافت محصول'
      return null
    } finally {
      isLoading.value = false
    }
  }

  /** @deprecated use fetchProductBySlug */
  async function fetchProductById(id: string): Promise<ProductDetail | null> {
    return fetchProductBySlug(id)
  }

  async function fetchRelatedProducts(
    category: string,
    excludeId: string,
    limit = 4
  ): Promise<Product[]> {
    try {
      const data = await $fetch<Record<string, unknown>[]>('/api/books', {
        query: { category, exclude: excludeId, limit },
      })
      return Array.isArray(data) ? data.map(mapBookToProduct) : []
    } catch {
      return []
    }
  }

  function addProduct(product: Product) {
    products.value.unshift(product)
  }

  function deleteProduct(id: string) {
    products.value = products.value.filter((p) => p._id !== id)
  }

  function clearCaches() {
    detailCache.clear()
  }

  const categories = computed(() => {
    const set = new Set(products.value.map((p) => p.category))
    return Array.from(set)
  })

  return {
    products,
    productsMapById,
    isLoading,
    error,
    categories,
    addProduct,
    deleteProduct,
    fetchCategoryProducts,
    fetchAllCategoriesProducts,
    searchProducts,
    fetchProductBySlug,
    fetchProductById,
    fetchRelatedProducts,
    clearCaches,
  }
})
