<template>
  <section class="w-full max-w-6xl mx-auto px-4 py-10">
    <!-- Loading -->
    <div v-if="isLoading" class="flex justify-center items-center h-64">
      <p class="text-gray-500 text-lg">در حال بارگذاری...</p>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="flex flex-col justify-center items-center h-64 text-center px-4">
      <h1 class="text-6xl font-bold text-red-500 mb-4">خطا</h1>
      <p class="text-xl text-gray-700 mb-6">{{ error }}</p>
      <NuxtLink
        to="/"
        class="bg-[#DCF763] hover:bg-[#c5e450] text-gray-900 font-semibold px-6 py-3 rounded-full"
      >
        بازگشت به صفحه اصلی
      </NuxtLink>
    </div>

    <!-- Product -->
    <div v-else class="flex flex-col md:flex-row gap-8 items-start">
      <!-- تصویر محصول -->
      <div class="flex-shrink-0 w-full md:w-1/3">
        <NuxtImg
          :src="product?.image || '/images/default-book.jpg'"
          :alt="product?.title"
          class="w-full rounded-2xl object-cover shadow-lg"
          width="300"
          height="420"
        />
      </div>

      <!-- جزئیات محصول -->
      <div class="flex-1 flex flex-col gap-4">
        <h1 class="text-3xl font-bold">{{ product?.title }}</h1>
        <p v-if="product?.author" class="text-gray-600">نویسنده: {{ product.author }}</p>
        <p v-if="product?.firstPublish" class="text-gray-500 text-sm">اولین انتشار: {{ product.firstPublish }}</p>
        <p v-if="product?.pages" class="text-gray-500 text-sm">تعداد صفحات: {{ product.pages }}</p>
        <p v-if="product?.format" class="text-gray-500 text-sm">فرمت: {{ product.format }}</p>

        <p class="mt-4 text-gray-700">{{ product?.summary }}</p>

        <div class="mt-6">
          <span class="text-2xl font-semibold">{{ formattedPrice }}</span>
        </div>

        <button
          @click="addToCart"
          class="mt-4 bg-[#435058] text-white font-semibold px-6 py-3 rounded-full hover:bg-[#5b6a6a] transition"
        >
          افزودن به سبد
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useProductStore } from '@/stores/productStore'
import { NuxtImg, NuxtLink } from '#components'

const route = useRoute()
const productStore = useProductStore()
const productId = route.params.id as string

const product = ref<ProductDetail | null>(null)
const isLoading = ref(true)
const error = ref<string | null>(null)

onMounted(async () => {
  try {
    const data = await productStore.fetchProductById(productId)
    if (!data) throw new Error('محصول مورد نظر یافت نشد')
    product.value = data
  } catch (err: any) {
    error.value = err.message
  } finally {
    isLoading.value = false
  }
})

const formattedPrice = computed(() => {
  return product.value
    ? new Intl.NumberFormat('fa-IR').format(product.value.price) + ' تومان'
    : ''
})

const addToCart = () => {
  if (!product.value) return
  const cartStore = useCartStore()
  cartStore.addToCart({
    id: product.value.id,
    name: product.value.title,
    price: product.value.price
  })
}

// --- SEO Meta
const metaDescription = computed(() => product.value?.summary || 'کتاب مورد نظر یافت نشد')
const metaTitle = computed(() => product.value?.title || 'محصول نامشخص')
const metaImage = computed(() => product.value?.image || '/images/default-book.jpg')
const metaUrl = computed(() => `https://yourdomain.com/product/${productId}`)

useSeoMeta({
  description: metaDescription.value,
  ogTitle: metaTitle.value,
  ogDescription: metaDescription.value,
  ogImage: metaImage.value,
  ogUrl: metaUrl.value,
  twitterTitle: metaTitle.value,
  twitterDescription: metaDescription.value,
  twitterImage: metaImage.value,
  twitterCard: 'summary_large_image'
})

useHead({
  htmlAttrs: { lang: 'fa' },
  link: [{ rel: 'icon', type: 'image/png', href: '/favicon.png' }]
})
</script>

<style scoped>
</style>
