export default defineNuxtRouteMiddleware(async (to) => {
    const auth = useAuthStore()
    await auth.fetchSession()

    if (!auth.isAuthenticated) {
        return navigateTo({ path: '/login', query: { redirect: to.fullPath } })
    }
})
