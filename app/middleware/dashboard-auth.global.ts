const DASHBOARD_ROLES = new Set(['user', 'admin', 'super-admin'])

export default defineNuxtRouteMiddleware(async (to) => {
  if (!to.path.startsWith('/dashboard')) return

  const authStore = useAuthStore()
  const api = import.meta.server ? useRequestFetch() : $fetch

  const res = await api<{
    ok: boolean
    user: { id: string; name: string; email: string; role?: string } | null
  }>('/api/user', { credentials: 'include' }).catch(() => null)

if (!res?.ok || !res.user) return navigateTo('/login')


  const role = res.user.role ?? 'user'
  if (!DASHBOARD_ROLES.has(role)) {
    return navigateTo('/')
  }

  authStore.user = res.user
  authStore.isAuthenticated = true
})