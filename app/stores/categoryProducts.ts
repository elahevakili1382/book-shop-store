//stores/categoryProduct.ts
import { defineStore } from 'pinia'

export interface Product {
  id: string
  title: string
  price: number
  image: string
  rating?: number   // اختیاری
  category: string
}

interface OpenLibraryResponse {
  works: {
    key: string
    title: string
    cover_id?: number
    rating?: number
  }[]
}

export const useCategoryProductStore = defineStore('categoryProduct', {
  state: () => ({
    products: [] as Product[],
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
    error: null as string | null
  }),

  getters: {
    filteredProducts: (state): Product[] =>
      state.products.filter(p => p.category === state.selectedCategory)
  },

  actions: {
    async fetchProducts(categoryKey: string) {
      this.isLoading = true
      this.error = null

      try {
        const { data, error: fetchError } = await useFetch<OpenLibraryResponse>(
          `https://openlibrary.org/subjects/${categoryKey}.json?limit=20`,
          { server: false }
        )

        if (fetchError.value) throw new Error(fetchError.value.message || 'خطا در دریافت محصولات')

        if (data.value?.works) {
          this.products = data.value.works
            .filter(book => book.cover_id) // فقط کتاب‌هایی که عکس دارند
            .map(book => ({
              id: book.key,
              title: book.title,
              price: Math.floor(Math.random() * 200000) + 50000, // قیمت تصادفی
              image: book.cover_id
                ? `https://covers.openlibrary.org/b/id/${book.cover_id}-L.jpg`
                : '/images/default-book.jpg',
              rating: book.rating ?? Math.round((Math.random() * 4 + 1) * 10) / 10, // اگر rating نبود، عدد تصادفی
              category: this.selectedCategory
            }))
        }
      } catch (e: any) {
        console.error('خطا در دریافت محصولات', e)
        this.error = e.message || 'خطای ناشناخته'
      } finally {
        this.isLoading = false
      }
    },

    setSelectedCategory(category: string) {
      this.selectedCategory = category

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

      const apiKey = categoryMap[category]
      if (apiKey) this.fetchProducts(apiKey)
    }
  }
})
