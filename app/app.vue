<template>
    <div class="bg-custom-gradient">
        <NuxtLayout>
            <NuxtPage/>
        </NuxtLayout>
    </div>
</template>
<script setup lang="ts">
import { onMounted } from 'vue'
import { useCartStore } from '@/stores/cart'

const cartStore = useCartStore()

onMounted(() => {
  cartStore.loadCart()
})
</script>
<style>
/* اطمینان از راست به چپ بودن کل پروژه */
body {
  direction: rtl;
}
</style>