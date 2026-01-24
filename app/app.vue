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
import { useCartStore } from '.././stores/cart'
import ToastContainer from './components/ToastContainer.vue'


const cartStore = useCartStore()

onMounted(() => {
  useAuthStore().loadFromStorage()
  cartStore.loadCart()
})
</script>
<style>
/* اطمینان از راست به چپ بودن کل پروژه */
body {
  direction: rtl;
}
</style>