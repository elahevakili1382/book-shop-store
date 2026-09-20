export default defineNuxtRouteMiddleware(async () => {
    const auth = useAuthStore()
    await auth.fetchSession()

    if (!auth.isAuthenticated) {
        return navigateTo('/login')
    }
})
