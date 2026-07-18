<template>
        <DashboardBreadcrumb :items="['داشبورد', 'محصولات']"/>

                <h1 class="m-5 font-semibold text-black text-2xl">مدیریت محصولات </h1>


    <productsTable :products="products" :loading="isLoading" @add="onAddProduct" @delete="onDeleteProduct"/>


</template>

<script setup lang="ts">
    import {computed, onMounted} from 'vue'
    import { useProductStore } from '../../stores/productStore';
    import productsTable from '../../components/dashboard/productsTable.vue';

    const store = useProductStore()
    const search = ref('')
    const debouncedSearch = useDebounce(search, 400)

    onMounted(()=>{
        store.fetchAllCategoriesProducts(10)
    })
   
    const products = computed(() => store.products)
    const isLoading = computed(() => store.isLoading)


function onAddProduct(product: any) {
  store.addProduct(product)
}

function onDeleteProduct(id: string) {
  store.deleteProduct(id)
}

watch(debouncedSearch, (value) =>{
  store.searchProducts(value)
})

 definePageMeta({
        title:'محصولات',
        layout :'dashboard',

    })


</script>