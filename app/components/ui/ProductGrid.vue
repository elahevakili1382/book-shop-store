<template>
  <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
    <ProductCard
      v-for="product in products"
      :key="product.id ?? product._id ?? product.title"
      :product="product"
    />
  </div>
</template>

<script setup lang="ts">
import ProductCard from './ProductCard.vue'

defineProps<{
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
