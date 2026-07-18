import { defineStore } from 'pinia'

export interface User {
  id: number
  name: string
  email: string
  username: string
}

export const useUserStore = defineStore('user', {
  state: () => ({
    users: [] as User[],
    selectedUser: null as User | null,
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async fetchUsers() {
      this.loading = true
      this.error = null

      try {
        this.users = await $fetch<User[]>(
          'https://jsonplaceholder.typicode.com/users'
        )
      } catch (e) {
        this.error = 'خطا در دریافت کاربران'
      } finally {
        this.loading = false
      }
    },

    selectUser(userId: number) {
      this.selectedUser =
        this.users.find(u => u.id === userId) || null
    },

    clearUser() {
      this.selectedUser = null
    },
  },
})
