<script setup lang="ts">
import { onMounted } from 'vue'
import { useAdminStore } from '.../../stores/adminStore'
// import AdminTable from '.././components/dashboard/AdminProfile'

const adminStore = useAdminStore()

onMounted(() => {
  adminStore.fetchAdmins()
})
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-xl font-bold">مدیریت ادمین‌ها</h1>

      <NuxtLink
        to="/dashboard/admins/create"
        class="px-4 py-2 bg-black text-white rounded"
      >
        افزودن ادمین
      </NuxtLink>
    </div>

    <AdminTable
      :admins="adminStore.admins"
      :loading="adminStore.loading"
    />
  </div>
</template>
