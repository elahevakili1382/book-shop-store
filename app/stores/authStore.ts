import { defineStore } from 'pinia'

interface User {
  id: string
  name: string
  email: string
  role?: string
}

type MeResponse = {
  ok: boolean
  user: User | null
}

function clearLegacyAuthStorage() {
  if (!import.meta.client) return
  localStorage.removeItem('token')
  localStorage.removeItem('user')
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    isAuthenticated: false,
  }),

  actions: {
    setUser(user: User | null) {
      this.user = user
      this.isAuthenticated = Boolean(user)
    },

    login(user: User) {
      this.setUser(user)
      clearLegacyAuthStorage()
    },

    async fetchSession() {
      try {
        const fetcher = import.meta.server ? useRequestFetch() : $fetch
        const res = await fetcher<MeResponse>('/api/user')
        this.setUser(res?.ok && res.user ? res.user : null)
      } catch {
        this.setUser(null)
      } finally {
        clearLegacyAuthStorage()
      }
    },

    async logout() {
      try {
        await $fetch('/api/auth/logout', { method: 'POST' })
      } catch {
        // cookie may already be gone
      }
      this.setUser(null)
      clearLegacyAuthStorage()
      await navigateTo('/login')
    },
  },
})
