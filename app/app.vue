<template>
    <div class="font-sans">
        <NuxtLayout>
          <ToastContainer/>
            <NuxtPage/>
        </NuxtLayout>
    </div>
</template>
<script setup lang="ts">
    import { onMounted, computed } from 'vue'
    import { useCartStore } from '../app/stores/cart'
    import { useWishlistStore } from '../app/stores/wishlist'
    import ToastContainer from './components/ToastContainer.vue'

    const cartStore = useCartStore()
    const wishlistStore = useWishlistStore()
    const route = useRoute()

    const isShot = computed(() => route.query.shot === '1' || route.query.shot === 'true')

    useHead({
      htmlAttrs: {
        class: computed(() => (isShot.value ? 'shot' : '')),
      },
    })

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
