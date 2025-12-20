// stores/product.ts
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
} from '.../../types/types'


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

/* ---------- Config ---------- */
const DEFAULT_PRICE = () => Math.floor(Math.random() * 200000) + 50000
const SEARCH_DEBOUNCE_MS = 400
const CACHE_TTL_MS = 1000 * 60 * 5 // 5 minutes

/* ---------- Helpers ---------- */
function now() { return Date.now() }
type CacheEntry<T> = { value: T, expiresAt: number }

function setCache<T>(map: Map<string, CacheEntry<T>>, key: string, value: T, ttl = CACHE_TTL_MS) {
  map.set(key, { value, expiresAt: now() + ttl })
}
function getCache<T>(map: Map<string, CacheEntry<T>>, key: string) {
  const e = map.get(key)
  if (!e) return null
  if (e.expiresAt < now()) { map.delete(key); return null }
  return e.value
}

/* Robust openId normalization:
   Accepts inputs like:
     - "OL4617640W"
     - "works/OL4617640W"
     - "/works/OL4617640W"
     - "works/works/OL4617640W"
   Always returns: "works/OL4617640W"
*/
function normalizeOpenId(idOrSlug: string | undefined): string | null {
  if (!idOrSlug) return null
  // force string, trim
  let s = String(idOrSlug).trim()
  // remove leading slashes
  s = s.replace(/^\/+/, '')
  // remove any leading repeated "works/" (case-insensitive)
  s = s.replace(/^(?:works\/)+/i, '')
  // now s is the bare id (e.g. OL4617640W or works/OL... removed)
  if (!s) return null
  return `works/${s}`
}

function mapWorkToProduct(book: Work | Doc, idx: number, categoryKey?: string): Product {
  const cover = (book as any).cover_id ?? (book as any).cover_i

  const key = (book as any).key || ''  // مثل /works/OL12345W

  return {
    id: key,                     // یکتا و ثابت
    openLibraryId: key,          // درست
    title: (book as any).title ?? 'بدون عنوان',
    price: DEFAULT_PRICE(),
    image: cover ? `https://covers.openlibrary.org/b/id/${cover}-L.jpg` : '/images/default-book.jpg',
    rating: (book as any).rating ?? Math.round((Math.random() * 4 + 1) * 10) / 10,
    category: categoryKey ?? ((book as any).subject?.[0] || 'نامشخص'),
    firstPublishYear: (book as any).first_publish_year ?? 0,
  } as Product
}


/* ---------- Store ---------- */
export const useProductStore = defineStore('productStore', () => {
  const products = ref<Product[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  /* caches */
  const categoryCache = new Map<string, CacheEntry<Product[]>>()
  const searchCache = new Map<string, CacheEntry<Product[]>>()
  const detailCache = new Map<string, CacheEntry<ProductDetail>>()

  /* inflight dedupe */
  const inflightCategory = new Map<string, Promise<Product[]>>()
  const inflightSearch = new Map<string, Promise<Product[]>>()
  const inflightDetail = new Map<string, Promise<ProductDetail | null>>()

  /* search debounce / abort */
  let searchTimer: ReturnType<typeof setTimeout> | null = null
  let searchAbort: AbortController | null = null

  /* category map */
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

  /* quick lookup map computed */
  const productsMapById = computed(() => {
    const m = new Map<string, Product>()
    for (const p of products.value) m.set(p.id, p)
    return m
  })

  /* ---------- fetchCategoryProducts ---------- */
  async function fetchCategoryProducts(categoryKey: string, options?: { force?: boolean, limit?: number }): Promise<Product[]> {
    const apiKey = categoryMap[categoryKey] ?? categoryKey ?? 'biography'
    const limit = options?.limit ?? 20
    const cacheKey = `${apiKey}:${limit}`

    const cached = getCache(categoryCache, cacheKey)
    if (cached && !options?.force) {
      products.value = cached
      return cached
    }

    if (inflightCategory.has(cacheKey)) return inflightCategory.get(cacheKey)!

    const p = (async () => {
      isLoading.value = true
      error.value = null
      try {
        const data = await $fetch<SubjectResponse>(`/api/subjects/${apiKey}?limit=${limit}`)
        const list = (data.works || [])
          .filter((b: Work) => (b as any).cover_id)
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

  /* ---------- searchProducts (client debounced) ---------- */
  async function searchProducts(query: string, options?: { force?: boolean, forceImmediate?: boolean }): Promise<Product[]> {
    const q = query.trim()
    if (!q) {
      products.value = []
      return []
    }

    const cacheKey = q.toLowerCase()
    const cached = getCache(searchCache, cacheKey)
    if (cached && !options?.force) {
      products.value = cached
      return cached
    }

    const runSearch = async () => {
      // abort previous
      if (searchAbort) {
        try { searchAbort.abort() } catch {}
      }
      searchAbort = typeof AbortController !== 'undefined' ? new AbortController() : null
      const signal = searchAbort?.signal

      if (inflightSearch.has(cacheKey)) return inflightSearch.get(cacheKey)!

      const p = (async () => {
        isLoading.value = true
        error.value = null
        try {
          const url = `/api/search?q=${encodeURIComponent(q)}`
          const data = await $fetch<SearchResponse>(url, signal ? { signal } as any : undefined)
          const list = (data.docs || [])
            .filter((b: Doc) => (b as any).cover_i)
            .map((b: Doc, i: number) => mapWorkToProduct(b as any, i))
          setCache(searchCache, cacheKey, list)
          products.value = list
          return list
        } catch (err: unknown) {
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

    if (process.client && !options?.forceImmediate) {
      if (searchTimer) clearTimeout(searchTimer)
      return new Promise<Product[]>((resolve) => {
        searchTimer = setTimeout(async () => {
          const res = await runSearch()
          resolve(res as Product[])
        }, SEARCH_DEBOUNCE_MS)
      })
    } else {
      return runSearch()
    }
  }

  /* ---------- unified fetchProduct (by id or slug) ---------- */
  async function fetchProductById(idOrSlug: string): Promise<ProductDetail | null> {
    const inflightKey = idOrSlug
    if (inflightDetail.has(inflightKey)) return inflightDetail.get(inflightKey)!

    const p = (async () => {
      isLoading.value = true
      error.value = null
      try {
        // try to find a local product first
        const product = products.value.find((p) => p.id === idOrSlug || p.openLibraryId.endsWith(idOrSlug))

        // normalize openId reliably
        const raw = product?.openLibraryId ?? idOrSlug
        const openId = normalizeOpenId(raw)
        if (!openId) {
          throw new Error('Invalid product identifier')
        }

        // cache hit
        const cached = getCache(detailCache, openId)
        if (cached) return cached

        // fetch main work data
        const workData = await $fetch<WorkDetail>(`/api/${openId}`)

        // author (safe)
        let authorName: string | undefined
        if (workData.authors?.length && workData.authors[0]?.author?.key) {
          const authorId = String(workData.authors[0].author.key).replace(/^\/+/, '').replace(/^authors\//i, '')
          try {
            const authorRes = await $fetch<{ name: string }>(`/api/authors/${authorId}`)
            authorName = authorRes.name
          } catch {
            // ignore author fetch failure
            authorName = undefined
          }
        }

        // editions (optional)
        let editionData: EditionEntry | undefined
        try {
          const editions = await $fetch<EditionResponse>(`/api/${openId}/editions?limit=5`)
          editionData = editions.entries.find(
            (e) => e.number_of_pages || e.physical_format || e.languages || e.publishers
          ) ?? editions.entries[0] ?? undefined
        } catch {
          editionData = undefined
        }

        const detailedProduct: ProductDetail = {
          ...(product ?? {
            id: openId,
            openLibraryId: openId,
            title: workData.title ?? 'بدون عنوان',
            price: DEFAULT_PRICE(),
            image: '/images/default-book.jpg',
            rating: 0,
            category: 'نامشخص',
            firstPublishYear: 0
          }),
          openLibraryId: openId,
          author: authorName,
          summary: typeof workData.description === 'string' ? workData.description : workData.description?.value,
          subjects: workData.subjects?.slice(0, 3) || [],
          firstPublish: workData.first_publish_date,
          pages: editionData?.number_of_pages,
          format: editionData?.physical_format,
          language: editionData?.languages?.[0]?.key.replace('/languages/', ''),
          publisher: editionData?.publishers?.[0],
          publishDate: editionData?.publish_date,
        }

        setCache(detailCache, openId, detailedProduct)
        return detailedProduct
      } catch (err: unknown) {
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

  /* ---------- fetchProductBySlug (convenience wrapper) ---------- */
  async function fetchProductBySlug(slug: string): Promise<ProductDetail | null> {
    if (!slug) return null
    // try cache by slug first
    const cached = getCache(detailCache, slug)
    if (cached) return cached
    // delegate to fetchProductById (idOrSlug)
    return fetchProductById(slug)
  }

  /* ---------- fetchAllCategoriesProducts (parallel batches) ---------- */
  async function fetchAllCategoriesProducts(limitPerCategory = 8): Promise<Product[]> {
    isLoading.value = true
    error.value = null
    try {
      const keys = Object.keys(categoryMap)
      const batchSize = 4
      const batches: string[][] = []
      for (let i = 0; i < keys.length; i += batchSize) batches.push(keys.slice(i, i + batchSize))

      const allProducts: Product[] = []
      for (const batch of batches) {
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

  /* ---------- utilities for dev / testing ---------- */
  function clearCaches() {
    categoryCache.clear()
    searchCache.clear()
    detailCache.clear()
  }

  /* ---------- return API ---------- */
  return {
    products,
    productsMapById,
    isLoading,
    error,

    // actions
    fetchCategoryProducts,
    searchProducts,
    fetchProductById,
    fetchProductBySlug,
    fetchAllCategoriesProducts,

    // helpers
    clearCaches,
  }
})
