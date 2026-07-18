<template>
    <div class="bg-custom-gradient">
        <NuxtLayout>
          <ToastContainer/>
            <NuxtPage/>
        </NuxtLayout>
    </div>
</template>
<script setup lang="ts">
import { onMounted } from 'vue'
import { useCartStore } from '../app/stores/cart'
import ToastContainer from './components/ToastContainer.vue'


const cartStore = useCartStore()

onMounted(() => {
  useAuthStore().loadFromStorage()
  cartStore.loadCart()
})
</script>
<style>
body {
  direction: rtl;
}
</style>