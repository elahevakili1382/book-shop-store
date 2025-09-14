<script setup lang="ts">
const route = useRoute()
const categoryId = route.params.id
</script>

<template>
  <div class="p-8">
    <h1 class="text-2xl font-bold">صفحه دسته‌بندی {{ categoryId }}</h1>
    <p>این صفحه به صورت داینامیک برای هر دسته ساخته میشه.</p>
  </div>
</template>
