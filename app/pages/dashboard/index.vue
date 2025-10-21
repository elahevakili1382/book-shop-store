<template>

  <div>
    <h2 class="text-xl font-semibold mb-4">خوش آمدید 👋</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      <div class="bg-white rounded-xl shadow p-6">
        <h3 class="font-medium mb-2">تعداد کتاب‌ها</h3>
        <p class="text-2xl font-bold">120</p>
      </div>
      <div class="bg-white rounded-xl shadow p-6">
        <h3 class="font-medium mb-2">کاربران فعال</h3>
        <p class="text-2xl font-bold">86</p>
      </div>
      <div class="bg-white rounded-xl shadow p-6">
        <h3 class="font-medium mb-2">سفارشات امروز</h3>
        <p class="text-2xl font-bold">24</p>
      </div>
    </div>
  </div>
</template><script setup lang="ts">
definePageMeta({
    layout:'dashboard'
})
</script>