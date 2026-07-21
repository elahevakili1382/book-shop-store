<script setup lang="ts">
import { onMounted } from 'vue'
const adminStore = useAdminStore()

onMounted(() => {
  adminStore.fetchAdmins()
})

</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-xl font-bold text-dash-text">مدیریت ادمین‌ها</h1>

      <NuxtLink to="/dashboard/admins/create"
        class="px-4 py-2 bg-dash-accent text-dash-bg font-bold rounded-xl hover:opacity-90">
        افزودن ادمین
      </NuxtLink>
    </div>

    <AdminTable :admins="adminStore.admins" :loading="adminStore.loading" />
  </div>
</template>
