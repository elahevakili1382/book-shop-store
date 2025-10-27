export default defineNuxtConfig({
  compatibilityDate:"2025-07-09",
   components: true,

  future:{
    compatibilityVersion:4,
  },
    css: [
    "@fontsource/vazir/index.css",
    '@fortawesome/fontawesome-svg-core/styles.css',
  ],
  // plugins:['~/plugins/swiper.client.ts'],
  

fontawesome: {
  component: 'FontAwesome',
  icons: {
    solid: [
      'book',
      'user',
      'headset',
      'handshake',
      'address-card',
      'location-dot',
      'phone',
      'envelope',
      'trash',
      'search',
    ],
    brands: ['facebook-f', 'twitter', 'instagram', 'linkedin-in'],
    regular: ['envelope'],
  },
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




  devtools: { enabled: true },
  modules: [
    "@nuxtjs/tailwindcss",
    "@nuxt/icon",
    "@nuxt/image",
    "@pinia/nuxt",
    "nuxt-swiper",
    "@vesp/nuxt-fontawesome",
    'nuxt-toast',
    'nuxt-authorization'
  ]

  
})