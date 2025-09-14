import { defineStore } from 'pinia'

interface Product {
  id: string
  title: string
  price: number
  image: string
  rating?: number
  category?: string
}

interface OpenLibraryResponse {
  docs: {
    key: string
    title: string
    cover_i?: number
    rating?: number
    subject?: string[]
  }[]
}

export const useProductStore = defineStore('products', {
  state: () => ({
    products: [] as Product[],
    isLoading: false,
    error: null as string | null
  }),
  actions: {
    async fetchProducts(query: string = 'programming') {
      this.isLoading = true
      this.error = null

      try {
        const { data, error: fetchError } = await useFetch<OpenLibraryResponse>(
          `https://openlibrary.org/search.json?q=${query}`,
          { server: true }
        )

        if (fetchError.value)
          throw new Error(fetchError.value.message || 'خطا در دریافت محصولات')

        if (data.value?.docs) {
          this.products = data.value.docs
          .filter(book => book.cover_i)
          .map((book) => ({
            id: book.key,
            title: book.title,
            price: Math.floor(Math.random() *200000) + 50000,
            // price: Math.floor(Math.random() *200000) + 50000, // قیمت فرضی
            image: book.cover_i
              ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
              : '/images/default-book.jpg',
            rating: book.rating !== undefined
            ?book.rating
            :Math.round((Math.random() * 4 + 1)*10 )/10,
            category: book.subject?.[0] || 'نامشخص'
          }))
        }
      } catch (e: any) {
        console.error('خطا در دریافت محصولات', e)
        this.error = e.message || 'خطای ناشناخته'
      } finally {
        this.isLoading = false
      }
    }
  }
})
