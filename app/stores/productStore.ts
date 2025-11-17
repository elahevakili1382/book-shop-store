import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type {
  SearchResponse,
  SubjectResponse,
  Doc,
  Work,
  Product as BaseProduct,
  WorkDetail,
  EditionEntry,
  EditionResponse,
} from '../../types/types' 

export interface Product extends BaseProduct {
  id: string
  openLibraryId: string
}

export interface ProductDetail extends Product {
  author?: string
  summary?: string
  pages?: number
  format?: string
  language?: string
  publisher?: string
  publishDate?: string
  subjects?: string[]
  firstPublish?: string
}

/** Config */
const DEFAULT_PRICE = () => Math.floor(Math.random() * 200000) + 50000
const SEARCH_DEBOUNCE_MS = 400
const CACHE_TTL_MS = 1000 * 60 * 5 // 5 minutes cache by default

/** Helpers */
function now() { return Date.now() }

type CacheEntry<T> = { value: T, expiresAt: number }

export const useProductStore = defineStore('productStore', () => {
  const products = ref<Product[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  /** caches */
  const categoryCache = new Map<string, CacheEntry<Product[]>>()
  const searchCache = new Map<string, CacheEntry<Product[]>>()
  const detailCache = new Map<string, CacheEntry<ProductDetail>>()

  /** in-flight dedupe maps */
  const inflightCategory = new Map<string, Promise<Product[]>>()
  const inflightSearch = new Map<string, Promise<Product[]>>()
const inflightDetail = new Map<string, Promise<ProductDetail | null>>()

  /** debounce / abort controller for client search */
  let searchTimer: ReturnType<typeof setTimeout> | null = null
  let searchAbort: AbortController | null = null

  /** category map (keep outside heavy functions) */
  const categoryMap: Record<string, string> = {
    "برنامه‌نویسی و کامپیوتر": "programming",
    "تاریخ": "history",
    "بیوگرافی عمومی": "biography",
    "فانتزی": "fantasy",
    "علوم": "science",
    "هنر": "art",
    "ورزش و ورزشکاران": "sports",
    "کتاب کودک": "children",
    "رمان عاشقانه": "romance",
    "تازه‌ها": "new",
    "پرفروش‌ها": "bestseller",
    "پیشنهادهای روز": "daily-offers",
  }

  const productsMapById = computed(() => {
    const m = new Map<string, Product>()
    for (const p of products.value) m.set(p.id, p)
    return m
  })

  /** util: transform API doc -> Product */
  function mapWorkToProduct(book: Work | Doc, idx: number, categoryKey?: string): Product {
    const cover = (book as any).cover_id ?? (book as any).cover_i
    return {
      id: (idx + 1).toString(),
      openLibraryId: (book as any).key ?? '',
      title: (book as any).title ?? 'بدون عنوان',
      price: DEFAULT_PRICE(),
      image: cover ? `https://covers.openlibrary.org/b/id/${cover}-L.jpg` : '/images/default-book.jpg',
      rating: (book as any).rating ?? Math.round((Math.random() * 4 + 1) * 10) / 10,
      category: categoryKey ?? ((book as any).subject?.[0] || 'نامشخص'),
      firstPublishYear: (book as any).first_publish_year ?? 0,
    } as Product
  }

  /** utility: cache helpers */
  function setCache<T>(map: Map<string, CacheEntry<T>>, key: string, value: T, ttl = CACHE_TTL_MS) {
    map.set(key, { value, expiresAt: now() + ttl })
  }
  function getCache<T>(map: Map<string, CacheEntry<T>>, key: string) {
    const e = map.get(key)
    if (!e) return null
    if (e.expiresAt < now()) { map.delete(key); return null }
    return e.value
  }

  /** --- fetchCategoryProducts (SSR-friendly, deduped, cached) --- */
  async function fetchCategoryProducts(categoryKey: string, options?: { force?: boolean, limit?: number }) {
    const apiKey = categoryMap[categoryKey] ?? categoryKey ?? 'biography'
    const limit = options?.limit ?? 20
    const cacheKey = `${apiKey}:${limit}` //ساخت کش کتفاوت و یکت 

    // cache hit
    const cached = getCache(categoryCache, cacheKey)
    if (cached && !options?.force) {
      products.value = cached
      return cached
    }

    // dedupe in-flight جلوگیری از دو درخواست جداگانه 
    if (inflightCategory.has(cacheKey)) {
      return inflightCategory.get(cacheKey)!
    }

    const p = (async () => {
      isLoading.value = true
      error.value = null
      try {
        const data = await $fetch<SubjectResponse>(`/api/subjects/${apiKey}?limit=${limit}`)
        const list = (data.works || [])
          .filter((b: Work) => b.cover_id)
          .map((b: Work, i: number) => mapWorkToProduct(b, i, categoryKey))
        setCache(categoryCache, cacheKey, list)
        products.value = list
        return list
      } catch (err: unknown) {
        error.value = err instanceof Error ? err.message : 'خطای ناشناخته'
        return [] as Product[]
      } finally {
        isLoading.value = false
        inflightCategory.delete(cacheKey)
      }
    })()

    inflightCategory.set(cacheKey, p)
    return p
  }

  /** --- searchProducts (debounced on client; SSR callers call with forceImmediate=true) --- */
  async function searchProducts(query: string, options?: { force?: boolean, forceImmediate?: boolean }) {
    const q = query.trim()
    if (!q) {
      products.value = []
      return []
    }

    // check cache
    const cacheKey = q.toLowerCase()
    const cached = getCache(searchCache, cacheKey)
    if (cached && !options?.force) {
      products.value = cached
      return cached
    }

    // If server-side or forcedImmediate, skip debounce
    const runSearch = async () => {
      // abort previous
      if (searchAbort) {
        try { searchAbort.abort() } catch {}
      }
      searchAbort = typeof AbortController !== 'undefined' ? new AbortController() : null
      const signal = searchAbort?.signal

      // dedupe
      if (inflightSearch.has(cacheKey)) return inflightSearch.get(cacheKey)!

      const p = (async () => {
        isLoading.value = true
        error.value = null
        try {
          const url = `/api/search?q=${encodeURIComponent(q)}`
          // $fetch accepts signal in Nuxt 4
          const data = await $fetch<SearchResponse>(url, signal ? { signal } as any : undefined)
          const list = (data.docs || [])
            .filter((b: Doc) => b.cover_i)
            .map((b: Doc, i: number) => mapWorkToProduct(b as any, i))
          setCache(searchCache, cacheKey, list)
          products.value = list
          return list
        } catch (err: unknown) {
          // If aborted, do nothing special (return empty)
          if ((err as any)?.name === 'AbortError') return []
          error.value = err instanceof Error ? err.message : 'خطای ناشناخته'
          return []
        } finally {
          isLoading.value = false
          inflightSearch.delete(cacheKey)
        }
      })()

      inflightSearch.set(cacheKey, p)
      return p
    }

    // client debounce
    if (process.client && !options?.forceImmediate) {
      if (searchTimer) clearTimeout(searchTimer)
      return new Promise<Product[]>((resolve) => {
        searchTimer = setTimeout(async () => {
          const res = await runSearch()
          resolve(res as Product[])
        }, SEARCH_DEBOUNCE_MS)
      })
    } else {
      // server or forceImmediate: run immediately
      return runSearch()
    }
  }

  /** --- fetchProductById (SSR-friendly, cache + safe) --- */
  async function fetchProductById(id: string): Promise<ProductDetail | null> {
    // try from current products
    const existing = productsMapById.value.get(id)
    if (existing) {
      // if we have basic product and cached detail -> return detail
      const cached = getCache(detailCache, existing.openLibraryId)
      if (cached) return cached
    }

    // find by complex key: if id format included category-index (created by fetchAll) store id as is
    // We'll map by openLibraryId when possible
    // If we already have detail inflight, reuse
    const inflightKey = id
    if (inflightDetail.has(inflightKey)) return inflightDetail.get(inflightKey)!

    const p = (async () => {
      isLoading.value = true
      error.value = null
      try {
        // Try to resolve openLibraryId first:
        const product = products.value.find((p) => p.id === id)
        const openId = product?.openLibraryId ?? id // fallback to id if it already is openLibraryId

        // cache hit
        const cached = getCache(detailCache, openId)
        if (cached) return cached

        // fetch work
        const workData = await $fetch<WorkDetail>(`/api/works/${openId}`)
        // author
        let authorName: string | undefined
        if (workData.authors?.length && workData.authors[0]?.author?.key) {
          const authorRes = await $fetch<{ name: string }>(`/api/authors${workData.authors[0].author.key}`)
          authorName = authorRes.name
        }
        const subjects: string[] = workData.subjects?.slice(0, 3) || []
        const firstPublish: string | undefined = workData.first_publish_date

        // editions
        let editionData: EditionEntry | undefined
        try {
          const editions = await $fetch<EditionResponse>(`/api/works/${workData.key}/editions?limit=5`)
          editionData = editions.entries.find(
            (e) => e.number_of_pages || e.physical_format || e.languages || e.publishers
          ) ?? editions.entries[0] ?? undefined
        } catch {
          editionData = undefined
        }

        const detailedProduct: ProductDetail = {
          ... (product ?? { id: openId, openLibraryId: openId, title: workData.title ?? 'بدون عنوان', price: DEFAULT_PRICE(), image: '/images/default-book.jpg', rating: 0, category: 'نامشخص', firstPublishYear: 0 }),
          openLibraryId: openId,
          author: authorName,
          summary: typeof workData.description === 'string' ? workData.description : workData.description?.value,
          subjects,
          firstPublish,
          pages: editionData?.number_of_pages,
          format: editionData?.physical_format,
          language: editionData?.languages?.[0]?.key.replace('/languages/', ''),
          publisher: editionData?.publishers?.[0],
          publishDate: editionData?.publish_date,
        }

        setCache(detailCache, openId, detailedProduct)
        return detailedProduct
      } catch (err) {
        error.value = err instanceof Error ? err.message : 'خطا در دریافت اطلاعات محصول'
        return null
      } finally {
        isLoading.value = false
        inflightDetail.delete(inflightKey)
      }
    })()

    inflightDetail.set(inflightKey, p)
    return p
  }

  /** --- fetchAllCategoriesProducts (parallel with limit) --- */
  async function fetchAllCategoriesProducts(limitPerCategory = 8) {
    isLoading.value = true
    error.value = null
    try {
      const keys = Object.keys(categoryMap)
      // run in parallel but not too many heavy requests (simple batching)
      const batches: string[][] = []
      const batchSize = 4
      for (let i = 0; i < keys.length; i += batchSize) {
        batches.push(keys.slice(i, i + batchSize))
      }

      const allProducts: Product[] = []
      for (const batch of batches) {
        // fetch batch in parallel
        const promises = batch.map((categoryKey) => fetchCategoryProducts(categoryKey, { limit: limitPerCategory }))
        const results = await Promise.all(promises)
        results.forEach((r) => allProducts.push(...r))
      }

      products.value = allProducts
      return allProducts
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'خطای ناشناخته'
      return []
    } finally {
      isLoading.value = false
    }
  }

  /** small helpers for testing / clearing caches */
  function clearCaches() {
    categoryCache.clear()
    searchCache.clear()
    detailCache.clear()
  }

  return {
    // state
    products,
    isLoading,
    error,

    // actions
    fetchCategoryProducts,
    searchProducts,
    fetchProductById,
    fetchAllCategoriesProducts,

    // helpers
    clearCaches,
  }
})
