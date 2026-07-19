import { defineStore } from 'pinia'
import type { Product } from '~/types/types'
import type { User, Order } from '../../types/dashboard'

export const useDashboardStore = defineStore('dashboard', {
  state: () => ({
    products: [] as Product[],
    users: [] as User[],
    orders: [] as Order[],
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async fetchDashboardData() {
      this.loading = true
      this.error = null

      try {
        const [products, users, orders] = await Promise.all([
          $fetch<Product[]>('/api/books'),
          $fetch<User[]>('/api/users'),
          $fetch<Order[]>('/api/orders', { query: { limit: 10 } }),
        ])

        this.products = products
        this.users = users
        this.orders = orders
      } catch (err) {
        this.error = 'خطا در دریافت اطلاعات'
      } finally {
        this.loading = false
      }
    },
  },

  getters: {
    totalBooks: (state) => state.products.length,
    totalUsers: (state) => state.users.length,
    lowStockBooks:(state) => state.products.filter((p) =>(p.stock ?? 0) <5).slice(0,5),
    totalStock: (state) =>
      state.products.reduce((sum, p) => sum + (p.stock || 0), 0),
    latestOrders: (state) => state.orders.slice(0, 5),
    ordersToday: (state) => {
      const today = new Date().toISOString().slice(0, 10)
      return state.orders.filter((o) => o.createdAt?.slice(0, 10) === today).length
    },
  },
})
