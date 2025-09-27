import 'nuxt-toast'

declare module 'nuxt-toast' {
  interface ModuleOptions {
    duration?: number
    className?: string
    keepOnHover?: boolean
  }
}
