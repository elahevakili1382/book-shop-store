// app/stores/userStore.ts
import { defineStore } from 'pinia'

interface User {
  name: string
  email: string
  avatar: string
}

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null as User | null,
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async fetchUser() {
      this.loading = true
      this.error = null

      try {
        const res = await $fetch<any>('https://randomuser.me/api/')
        const data = res.results[0]

        this.user = {
          name: `${data.name.first} ${data.name.last}`,
          email: data.email,
          avatar: data.picture.medium,
        }
      } catch (e) {
        this.error = 'خطا در دریافت اطلاعات کاربر'
      } finally {
        this.loading = false
      }
    },
  },
})
