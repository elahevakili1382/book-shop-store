export interface Product {
  _id: string
  id?: string | number
  title: string
  titleEn?: string
  description: string
  price: number
  image: string
  category: string
  stock: number
  quantity: number
  slug?: string
  author?: string
  rating?: number
  reviewCount?: number
  pages?: number
  publisher?: string
  format?: string
  publishedYear?: number
  translator?: string
  isbn?: string
}

export interface ProductReview {
  id: string
  bookSlug: string
  authorName: string
  rating: number
  comment: string
  createdAt: string
}

export interface ReviewsResponse {
  bookSlug: string
  total: number
  averageRating: number
  reviews: ProductReview[]
}
