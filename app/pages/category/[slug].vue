<template>
  <section class="max-w-[1400px] mx-auto px-4 py-12">
    <h1 class="text-3xl font-bold mb-8">کتاب‌های دسته: {{ categoryName }}</h1>

    <div v-if="isLoading" class="text-center py-10">در حال بارگذاری...</div>
    <div v-else-if="products.length" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 justify-items-center">
      <ProductCard v-for="book in products" :key="book.id" :product="book" />
    </div>
    <p v-else class="text-gray-500">هیچ کتابی برای این دسته پیدا نشد.</p>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useCategoryStore } from '../../stores/categories'
import { useProductStore } from '../../stores/productStore'
import ProductCard from '../../components/ui/ProductCard.vue'

const route = useRoute()
const router = useRouter()
const slug = (route.params.slug as string) || ''

const categoryStore = useCategoryStore()
const productStore = useProductStore()

// اگر دسته‌ها هنوز لود نشده باشند، ابتدا آنها را بار می‌کنیم
onMounted(async () => {
  if (!categoryStore.categories.length) {
    await categoryStore.fetchCategories()
  }

  const cat = categoryStore.categories.find(c => c.slug === slug)
  if (!cat) {
    // صفحه 404
    return router.replace('/404') // یا throw createError({ statusCode: 404, statusMessage: 'دسته یافت نشد' })
  }

  // fetch با نام فارسیِ دسته (همون مقدار name) — چون fetchCategoryProducts تو استورتون انتظار نام فارسی داره
  await productStore.fetchCategoryProducts(cat.name)
})

const categoryName = computed(() => {
  const c = categoryStore.categories.find(c => c.slug === slug)
  return c?.name ?? ''
})

const products = computed(() => productStore.products)
const isLoading = computed(() => productStore.isLoading)
</script>
