export interface User {
  _id: string
  id?: string
  name: string
  email: string
  role?: 'user' | 'admin' | 'super-admin'
  createdAt?: string
  updatedAt?: string
}

export type OrderStatus = 'pending' | 'paid' | 'failed' | 'shipped'

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
  paymentMethod: 'online' | 'cod'
  status: OrderStatus
  authority?: string
  items: OrderItem[]
  createdAt?: string
  updatedAt?: string
}
