<template>
  <div class="grid grid-cols-2 gap-x-3 gap-y-5 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
    <ProductCard
      v-for="(product, i) in products"
      :key="product.id ?? product._id ?? product.title"
      :product="product"
      compact
      :index="numbered ? i + 1 : undefined"
    />
  </div>
</template>

<script setup lang="ts">
import ProductCard from './ProductCard.vue'

defineProps<{
  numbered?: boolean
  products: Array<{
    id?: string | number
    _id?: string
    title: string
    price: number
    image?: string
    stock?: number
    slug?: string
    rating?: number
    category?: string
  }>
}>()
</script>
