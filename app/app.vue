<template>
    <div class="font-sans">
        <NuxtLayout>
          <ToastContainer/>
            <NuxtPage/>
        </NuxtLayout>
    </div>
</template>
<script setup lang="ts">
    import { onMounted } from 'vue'
    import { useCartStore } from '../app/stores/cart'
    import { useWishlistStore } from '../app/stores/wishlist'
    import ToastContainer from './components/ToastContainer.vue'

    const cartStore = useCartStore()
    const wishlistStore = useWishlistStore()

    onMounted(() => {
      cartStore.loadCart()
      wishlistStore.load()
    })
</script>
<style>
body {
  direction: rtl;
}
</style>
