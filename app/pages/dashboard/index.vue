<!-- pages/dashboard/index.vue -->
<template>
  <div class="space-y-8">
    <!-- 🔹 بخش کارت‌های بالایی -->
    <ProgressCard />
  </div>


</template>

<script setup lang="ts">

import ProgressCard from '../../components/dashboard/ProgressCard.vue';


definePageMeta({
  title: 'داشبورد ادمین',
  layout: 'dashboard',
})
</script>
