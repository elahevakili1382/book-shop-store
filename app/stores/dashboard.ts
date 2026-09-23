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
    reviewsTotal: 0,
  }),

  actions: {
    async fetchDashboardData() {
      this.loading = true
      this.error = null

      try {
        const [products, users, orders, reviews] = await Promise.all([
          $fetch<Product[]>('/api/books', { query: { full: '1', limit: 80 } }),
          $fetch<User[]>('/api/users'),
          $fetch<Order[]>('/api/orders', { query: { limit: 200 } }),
          $fetch<{ totalCount: number }>('/api/dashboard/reviews'),
        ])

        this.products = products
        this.users = users
        this.orders = orders
        this.reviewsTotal = reviews?.totalCount ?? 0
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
    lowStockCount: (state) => state.products.filter((p) => (p.stock ?? 0) < 5).length,
    lowStockBooks: (state) => state.products.filter((p) => (p.stock ?? 0) < 5).slice(0, 5),
    totalStock: (state) =>
      state.products.reduce((sum, p) => sum + (p.stock || 0), 0),
    latestOrders: (state) => state.orders.slice(0, 5),
    ordersToday: (state) => {
      const today = new Date().toISOString().slice(0, 10)
      return state.orders.filter((o) => o.createdAt?.slice(0, 10) === today).length
    },

    // 🔹 new expanded metrics
    totalRevenue: (state) => {
      return state.orders
        .filter((o) => o.status === 'paid' || o.status === 'shipped')
        .reduce((sum, o) => sum + (o.amount || 0), 0)
    },

    averageOrderValue: (state) => {
      const paid = state.orders.filter((o) => o.status === 'paid' || o.status === 'shipped')
      if (!paid.length) return 0
      const total = paid.reduce((sum, o) => sum + (o.amount || 0), 0)
      return Math.round(total / paid.length)
    },

    pendingOrdersCount: (state) => {
      return state.orders.filter((o) => o.status === 'pending').length
    },

    newUsersThisMonth: (state) => {
      const now = new Date()
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      return state.users.filter((u) => {
        const created = u.createdAt ? new Date(u.createdAt) : null
        return created && created >= startOfMonth
      }).length
    },

    averageRating: (state) => {
      const withRating = state.products.filter((p) => (p.rating ?? 0) > 0)
      if (!withRating.length) return 0
      const sum = withRating.reduce((s, p) => s + (p.rating ?? 0), 0)
      return Math.round((sum / withRating.length) * 10) / 10
    },
  },
})
