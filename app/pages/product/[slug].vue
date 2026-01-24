<template>
  <section class="w-full max-w-6xl mx-auto px-4 py-12">
    <!-- Loading -->
    <div v-if="isLoading" class="flex justify-center items-center h-64">
      <p class="text-gray-500 text-lg animate-pulse">در حال بارگذاری...</p>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="flex flex-col justify-center items-center h-64 text-center px-4">
      <h1 class="text-6xl font-bold text-red-500 mb-4">خطا</h1>
      <p class="text-xl text-gray-700 mb-6">{{ error }}</p>
      <NuxtLink to="/" class="bg-fruit-yellow hover:bg-[#c5e450] text-gray-900 font-semibold px-6 py-3 rounded-full transition">
        بازگشت به صفحه اصلی
      </NuxtLink>
    </div>

    <!-- Product -->
    <div v-else class="flex flex-col md:flex-row gap-10 items-start bg-white rounded-2xl shadow-lg p-6 transition hover:shadow-2xl">
      <!-- تصویر محصول -->
      <div class="flex-shrink-0 w-full md:w-1/3 relative group">
        <NuxtImg
          :src="product?.image || '/images/default-book.jpg'"
          :alt="product?.title"
          class="w-full h-auto rounded-2xl object-cover shadow-md transform transition group-hover:scale-105"
          width="300"
          height="420"
        />
        <div v-if="product?.rating" class="absolute top-4 left-4 bg-[#DCF763] text-[#435058] px-3 py-1 rounded-full flex items-center gap-1 font-semibold text-sm shadow-md">
          <NuxtImg src="/images/Vector-(3).svg" alt="امتیاز" width="16" height="16" />
          {{ product.rating }}
        </div>
      </div>

      <!-- جزئیات محصول -->
      <div class="flex-1 flex flex-col gap-4">
        <h1 class="text-3xl font-extrabold text-gray-900">{{ product?.title }}</h1>
        <p v-if="product?.author" class="text-gray-600 text-lg">نویسنده: {{ product.author }}</p>
        <p v-if="product?.firstPublish" class="text-gray-500 text-sm">اولین انتشار: {{ product.firstPublish }}</p>
        <p v-if="product?.pages" class="text-gray-500 text-sm">تعداد صفحات: {{ product.pages }}</p>
        <p v-if="product?.format" class="text-gray-500 text-sm">فرمت: {{ product.format }}</p>
        <p class="mt-4 text-gray-700 leading-relaxed">{{ product?.summary }}</p>

        <div class="mt-6 flex items-center gap-4">
          <span class="text-2xl font-bold text-gray-900">{{ formattedPrice }}</span>
        </div>

        <!-- تعداد -->
        <div class="flex items-center gap-3 mt-4">
          <button @click="decreaseQuantity" class="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 bg-gray-50 hover:bg-gray-100 text-lg transition">-</button>
          <span class="font-medium text-lg">{{ quantity }}</span>
          <button @click="increaseQuantity" class="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 bg-gray-50 hover:bg-gray-100 text-lg transition">+</button>
        </div>

        <!-- افزودن به سبد -->
        <button @click="addToCart" class="mt-6 bg-[#435058] text-white font-semibold px-5 py-2 rounded-full hover:bg-[#5b6a6a] transition flex items-center justify-center gap-1 shadow-lg">
          افزودن به سبد
          <NuxtImg src="/images/user.svg" alt="سبد خرید" width="20" height="20" />
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
// ✅ درست: useRoute از nuxt/navigation
import { useCartStore } from '@/stores/cart'
import type { ProductDetail } from '@/stores/productStore'
import { useProductStore } from '@/stores/productStore'

const cartStore = useCartStore()
const quantity = ref(1)
const toast = useToast()

const route = useRoute()
const router = useRouter()
const productStore = useProductStore()

const slug = ref(route.params.slug as string)
const product = ref<ProductDetail | null>(null)
const isLoading = ref(true)
const error = ref<string | null>(null)

// Computed: safe URL
const productUrl = computed(() => `/product/${slug.value}`)

// Fetch product by slug -> map to id
async function fetchProduct() {
  isLoading.value = true
  error.value = null
  try {
    const allProducts = await productStore.fetchAllCategoriesProducts()
    const found = allProducts.find(p => p.title.toLowerCase().replace(/\s+/g, '-') === slug.value.toLowerCase())
    if (!found) throw new Error('محصول مورد نظر یافت نشد')
    const data = await productStore.fetchProductById(found.id)
    if (!data) throw new Error('جزئیات محصول یافت نشد')
    product.value = data
  } catch (err: any) {
    error.value = err.message
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchProduct)

// اگر slug تغییر کرد، دوباره fetch کن
watch(() => route.params.slug, (newSlug) => {
  slug.value = newSlug as string
  fetchProduct()
})

const formattedPrice = computed(() =>
  product.value ? new Intl.NumberFormat('fa-IR').format(product.value.price) + ' تومان' : ''
)

const increaseQuantity = () => quantity.value++
const decreaseQuantity = () => { if (quantity.value > 1) quantity.value-- }

const addToCart = () => {
  if (!product.value) return
  cartStore.addToCart(
    {
      id: product.value.id,
      name: product.value.title,
      price: product.value.price,
      image: product.value.image || '/images/default-book.jpg'
    },
    quantity.value
  )
  toast.success({
    message: `محصول "${product.value?.title}" به سبد خرید اضافه شد.`,
    color: 'green',
    position: 'topRight',
  })
}
</script>


<style scoped>
button:hover { cursor: pointer; }
.group-hover\:scale-105 { transition: transform 0.3s ease-in-out; }
h1,h2,p { line-height: 1.5; }
</style>
