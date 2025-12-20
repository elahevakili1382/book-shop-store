import { defineStore } from "pinia";
import type { Product, User } from "../../types/dashboard";

export const useDashboardStore = defineStore('dashboard', {
  state: () => ({
    products: [] as Product[],
    users: [] as User[],
    loading: false,
    error: null as string | null
  }),

  actions: {
    async fetchDashboardData() {
      this.loading = true
      this.error = null

      try {
        const products = await $fetch<Product[]>('https://fakestoreapi.com/products')
        const users = await $fetch<User[]>('https://fakestoreapi.com/users')

        this.products = products
        this.users = users
      } catch (err) {
        this.error = "خطا در دریافت اطلاعات"
      } finally {
        this.loading = false
      }
    }
  },

  getters: {
    totalSales: (state) => state.products.reduce((sum, p) => sum + p.price, 0),
    totalUsers: (state) => state.users.length
  }
})
