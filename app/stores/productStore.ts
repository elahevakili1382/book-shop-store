// stores/productStore.ts
import { defineStore } from 'pinia'

export interface Product {
  id: string
  title: string
  price: number
  image: string
  rating?: number
  category: string
}

interface OpenLibraryDoc {
  key: string
  title: string
  cover_i?: number
  subject?: string[]
}

interface OpenLibraryResponse {
  docs?: OpenLibraryDoc[]
  works?: {
    key: string
    title: string
    cover_id?: number
    rating?: number
  }[]
}

interface ProductState {
  products: Product[]
  categories: string[]
  selectedCategory: string
  isLoading: boolean
  error: string | null
}

export const useProductStore = defineStore('productStore', {
  state: (): ProductState => ({
    products: [],
    categories: [
      'برنامه‌نویسی و کامپیوتر',
      'تاریخ',
      'بیوگرافی عمومی',
      'فانتزی',
      'علوم',
      'هنر',
      'ورزش و ورزشکاران',
      'کتاب کودک',
      'رمان عاشقانه'
    ],
    selectedCategory: 'بیوگرافی عمومی',
    isLoading: false,
    error: null
  }),

  getters: {
    filteredProducts: (state): Product[] =>
      state.products.filter(p => p.category === state.selectedCategory)
  },

  actions: {
    // بارگذاری از OpenLibrary بر اساس دسته‌بندی
    async fetchCategoryProducts(categoryKey: string) {
      this.isLoading = true
      this.error = null

      const categoryMap: Record<string, string> = {
        'برنامه‌نویسی و کامپیوتر': 'programming',
        'تاریخ': 'history',
        'بیوگرافی عمومی': 'biography',
        'فانتزی': 'fantasy',
        'علوم': 'science',
        'هنر': 'art',
        'ورزش و ورزشکاران': 'sports',
        'کتاب کودک': 'children',
        'رمان عاشقانه': 'romance'
      }

      const apiKey = categoryMap[categoryKey] || 'biography'

      try {
        const { data, error: fetchError } = await useFetch<OpenLibraryResponse>(
          `https://openlibrary.org/subjects/${apiKey}.json?limit=20`,
          { server: false }
        )

        if (fetchError.value) throw new Error(fetchError.value.message || 'خطا در دریافت محصولات')

        if (data.value?.works) {
          this.products = data.value.works
            .filter(book => book.cover_id)
            .map(book => ({
              id: book.key,
              title: book.title,
              price: Math.floor(Math.random() * 200000) + 50000,
              image: book.cover_id
                ? `https://covers.openlibrary.org/b/id/${book.cover_id}-L.jpg`
                : '/images/default-book.jpg',
              rating: book.rating ?? Math.round((Math.random() * 4 + 1) * 10) / 10,
              category: categoryKey
            }))
        }
      } catch (err: unknown) {
        this.error = err instanceof Error ? err.message : 'خطای ناشناخته'
      } finally {
        this.isLoading = false
      }
    },

    // جستجوی عمومی
    async searchProducts(query: string) {
      this.isLoading = true
      this.error = null

      try {
        const { data, error } = await useFetch<OpenLibraryResponse>(
          `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`,
          { server: true }
        )

        if (error.value) throw new Error(error.value.message || 'خطا در دریافت محصولات')

        if (data.value?.docs) {
          this.products = data.value.docs
            .filter(book => book.cover_i)
            .map(book => ({
              id: book.key,
              title: book.title,
              price: Math.floor(Math.random() * 200000) + 50000,
              image: book.cover_i
                ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
                : '/images/default-book.jpg',
              rating: Math.round((Math.random() * 4 + 1) * 10) / 10,
              category: book.subject?.[0] || 'نامشخص'
            }))
        }
      } catch (err: unknown) {
        this.error = err instanceof Error ? err.message : 'خطای ناشناخته'
      } finally {
        this.isLoading = false
      }
    },

    setSelectedCategory(category: string) {
      this.selectedCategory = category
      this.fetchCategoryProducts(category)
    }
  }
})
