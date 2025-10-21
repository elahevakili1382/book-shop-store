<!-- pages/dashboard/index.vue -->
<template>
  <div class="space-y-6">
    <h2 class="text-2xl font-bold text-gray-800">خوش آمدید 👋</h2>

    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

      <!-- کارت 1 -->
      <div
        class="rounded-2xl shadow-md transition p-6 bg-white
               hover:bg-gradient-to-br hover:from-blue-600 hover:via-blue-700 hover:to-blue-800
               hover:text-white hover:shadow-xl"
      >
        <h3 class="font-medium mb-2">تعداد کتاب‌ها</h3>
        <p class="text-3xl font-bold">120</p>
      </div>

      <!-- کارت 2 -->
      <div
        class="rounded-2xl shadow-md transition p-6 bg-white
               hover:bg-gradient-to-br hover:from-blue-600 hover:via-blue-700 hover:to-blue-800
               hover:text-white hover:shadow-xl"
      >
        <h3 class="font-medium mb-2">کاربران فعال</h3>
        <p class="text-3xl font-bold">86</p>
      </div>

      <!-- کارت 3 -->
      <div
        class="rounded-2xl shadow-md transition p-6 bg-white
               hover:bg-gradient-to-br hover:from-blue-600 hover:via-blue-700 hover:to-blue-800
               hover:text-white hover:shadow-xl"
      >
        <h3 class="font-medium mb-2">سفارشات امروز</h3>
        <p class="text-3xl font-bold">24</p>
      </div>

      <!-- کارت 4 -->
      <div
        class="rounded-2xl shadow-md transition p-6 bg-white
               hover:bg-gradient-to-br hover:from-blue-600 hover:via-blue-700 hover:to-blue-800
               hover:text-white hover:shadow-xl"
      >
        <h3 class="font-medium mb-2">سفارشات امروز</h3>
        <p class="text-3xl font-bold">24</p>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
});
</script>
