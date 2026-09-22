type AuthMeResponse = {
  ok: boolean
  user: { id: string; name: string; email: string; role?: string } | null
}

export default defineNuxtRouteMiddleware(async () => {
  let res: AuthMeResponse | null = null

  try {
    if (import.meta.server) {
      const requestFetch = useRequestFetch() as (url: string) => Promise<AuthMeResponse> //درخواست مرورگر را دنبال می کند و کوکی را می بیند 
      res = await requestFetch('/api/user') // کاربر فعلی کیست 
    } else {
      res = await ($fetch as (url: string, opts?: object) => Promise<AuthMeResponse>)(
        '/api/user',
        { credentials: 'include' }
      )
    }
  } catch {
    res = null
  }

  if (res?.ok && res.user) {
    const role = res.user.role ?? 'user'
    if (role === 'admin' || role === 'super-admin') {
      return navigateTo('/dashboard')
    }
    return navigateTo('/account')
  }
})
//  روی سرور، با ابزاری که کوکی را هم می‌برد، می‌پرسی کاربر لاگین است یا نه