export default defineNuxtConfig({
  compatibilityDate:"2025-07-09",
   components: true,

  future:{
    compatibilityVersion:4,
  },
    css: [
    "@fontsource/vazir/index.css"
  ],
  

fontawesome: {
    // پک‌های مورد نیاز
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
        'envelope'
      ],
      brands: [
        'facebook-f',
        'twitter',
        'instagram',
        'linkedin-in'
      ],
      regular: [
        'envelope'
      ]
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
}

,
  devtools: { enabled: true },
  modules: [
    "@nuxtjs/tailwindcss",
    "@nuxt/icon",
    "@nuxt/image",
    "@pinia/nuxt",
    "nuxt-swiper",
    "@vesp/nuxt-fontawesome"
  ]
})