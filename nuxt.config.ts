import { resolve } from 'pathe'
export default defineNuxtConfig({
  
  compatibilityDate:"2025-07-09",
    components: {
      

    dirs: [
      '~/components',
      '~/app/components',
      
    ]
  },
   alias: {
    '@': resolve(__dirname, 'app'),
    '~': resolve(__dirname, 'app'),
  },
 
  future:{
    compatibilityVersion:4,
  },
    css: [
    "~/assets/main.css",
  ],
  
runtimeConfig: {
  mongodbUri: process.env.MONGODB_URI || process.env.MONGODB_URL || '',
  apiSecret: '',
  public: { /* بدون تغییر */ }
},

  app:{
    head:{
      htmlAttrs: { lang: 'fa', dir: 'rtl' },
      title:"website",
      titleTemplate:'%s | Book-store',
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;500;600;700;800;900&display=swap',
        },
      ],
    }
  },

  $development:{
    app:{
      head:{
        title:'Dev',
        htmlAttrs: { lang: 'fa', dir: 'rtl' },
      }
    }
  },

  build: {
    transpile: ['vue-echarts', 'echarts', 'zrender'],
  },
  vite: {
    ssr: {
      noExternal: ['vue-echarts', 'echarts'],
    },
  },
  image: {
    domains: ['fakestoreapi.com', 'images.unsplash.com', 'covers.openlibrary.org'],
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
    'nuxt-authorization',
    'motion-v/nuxt',
  ]

  
})