<template>
  <main class="min-h-screen">
    <div class="mx-auto max-w-[1120px] px-4 py-10 sm:px-8">
      <h1 class="text-2xl font-black text-slate sm:text-3xl">علاقه‌مندی‌ها</h1>
      <p class="mt-2 text-sm text-slate/55">کتاب‌هایی که برای بعد ذخیره کرده‌ای.</p>

      <div v-if="pending" class="mt-10 rounded-3xl border border-slate/8 bg-white py-16 text-center text-slate/45">
        در حال بارگذاری...
      </div>

      <div
        v-else-if="!products.length"
        class="mt-10 rounded-3xl border border-slate/8 bg-white px-6 py-16 text-center"
      >
        <p class="font-bold text-slate">هنوز کتابی ذخیره نشده</p>
        <p class="mt-2 text-sm text-slate/50">از صفحه محصول، قلب را بزن تا اینجا جمع شود.</p>
        <NuxtLink
          to="/new"
          class="mt-6 inline-flex rounded-2xl bg-slate px-5 py-2.5 text-sm font-bold text-white"
        >
          دیدن تازه‌ها
        </NuxtLink>
      </div>

      <ProductGrid v-else class="mt-8" :products="products" />
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import ProductGrid from '../components/ui/ProductGrid.vue'
import { useWishlistStore } from '../stores/wishlist'
import type { Product } from '~/types/types'

definePageMeta({
  layout: 'default',
})

useSeoMeta({
  title: 'علاقه‌مندی‌ها | Booklett',
})

const wishlist = useWishlistStore()
onMounted(() => wishlist.load())

const { data, pending } = await useAsyncData('wishlist-books', async () => {
  return await $fetch<Product[]>('/api/books', { query: { limit: 80 } })
})

const products = computed(() => {
  const catalog = data.value ?? []
  const wanted = new Set(wishlist.ids.map(String))
  return catalog.filter((book) => wanted.has(String(book.id ?? book._id)))
})
</script>
