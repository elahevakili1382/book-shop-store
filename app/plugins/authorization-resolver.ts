// plugins/authorization-resolver.ts
import { defineNuxtPlugin } from 'nuxt/app'
import { useUserSession } from '../composables/useUserSession' // فرضی: تابعی که user session رو مدیریت میکنه

export default defineNuxtPlugin({
  name: 'authorization-resolver',
  parallel: true,
  setup() {
    return {
      provide: {
        authorization: {
          resolveClientUser: () => {
            // return user from client
            return useUserSession().user.value
          },
        },
      },
    }
  },
})
