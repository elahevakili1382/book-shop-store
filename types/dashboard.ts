export interface User {
  _id: string
  id?: string
  name: string
  email: string
  phone?: string
  city?: string
  province?: string
  address?: string
  role?: 'user' | 'admin' | 'super-admin'
  createdAt?: string
  updatedAt?: string
}

export type OrderStatus = 'pending' | 'paid' | 'failed' | 'shipped'

export interface ReviewItem {
  id: string
  bookSlug: string
  bookTitle: string
  authorName: string
  rating: number
  comment: string
  createdAt: string
}

export interface ReviewsResponse {
  reviews: ReviewItem[]
  totalCount: number
}

export interface OrderItem {
  title: string
  price: number
  quantity: number
  bookId?: string
}

export interface Order {
  _id: string
  id?: string
  customerName: string
  phone: string
  address?: string
  city?: string
  postalCode?: string
  amount: number
  paymentMethod: 'online' | 'cod' | 'wallet'
  status: OrderStatus
  authority?: string
  items: OrderItem[]
  createdAt?: string
  updatedAt?: string
}
