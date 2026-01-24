export default defineNuxtRouteMiddleware(() => {
    const auth = useAuthStore()

   
        auth.loadFromStorage()
 

    if(!auth.isAuthenticated) {
        return navigateTo('/login')
    }
})