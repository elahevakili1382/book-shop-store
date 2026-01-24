export default defineNuxtConfig({
  
  compatibilityDate:"2025-07-09",
    components: {
      

    dirs: [
      '~/components',
      '~/app/components',
      
    ]
  },
 alias: {
    '@': '/app',
    '~': '/app',
  },
  future:{
    compatibilityVersion:4,
  },
    css: [
    "@fontsource/vazir/index.css",
  ],
  
runtimeConfig: {
  apiSecret: '',
  public: {
    externalApiBase: 'https://fakestoreapi.com'
  }
},

  app:{
    head:{
      title:"website",
      titleTemplate:'%s | Book-store'
    }

  },

  $development:{
    app:{
      head:{
        title:'Dev'
      }
    }
  },

  image: {
  domains: ['fakestoreapi.com']
},
toast: {
  duration: 3000,
  className: 'rounded-full shadow-lg bg-green-50 text-green-800 font-bold text-xl',
  keepOnHover: true
} as any,

 nitro: {
    routeRules: {
      '/archive/**': { proxy: 'https://archive.org/**' }
    }
  },


  devtools: { enabled: true },
  modules: [
    "@nuxtjs/tailwindcss",
    "@nuxt/icon",
    "@nuxt/image",
    "@pinia/nuxt",
    "nuxt-swiper",
    'nuxt-toast',
    'nuxt-authorization'
  ]

  
})