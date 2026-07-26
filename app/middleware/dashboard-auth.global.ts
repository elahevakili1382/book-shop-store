const DASHBOARD_ROLES = new Set<string>(['user', 'admin', 'super-admin'])

type AuthMeResponse = {
  ok: boolean
  user: { id: string; name: string; email: string; role?: string } | null
}

export default defineNuxtRouteMiddleware(async (to) => {
  if (!to.path.startsWith('/dashboard')) return

  const authStore = useAuthStore()

  let res: AuthMeResponse | null = null

  try {
    // شاخه‌ها جدا — تا TS تایپ $fetch و useRequestFetch را با هم قاطی نکند
    if (import.meta.server) {
      const requestFetch = useRequestFetch() as (url: string) => Promise<AuthMeResponse>
      res = await requestFetch('/api/user')
    } else {
      res = await ($fetch as (url: string, opts?: object) => Promise<AuthMeResponse>)(
        '/api/user',
        { credentials: 'include' }
      )
    }
  } catch {
    res = null
  }

  if (!res?.ok || !res.user) {
    return navigateTo('/login')
  }

  const role = res.user.role ?? 'user'
  if (!DASHBOARD_ROLES.has(role)) {
    return navigateTo('/')
  }

  authStore.user = res.user
  authStore.isAuthenticated = true
})
