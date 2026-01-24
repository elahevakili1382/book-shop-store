<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAdminStore } from '.../../stores/adminStore'
// import AdminForm from '@/components/dashboard/admins/AdminForm.vue'

const router = useRouter()
const adminStore = useAdminStore()

const handleSubmit = (adminData: {
  name: string
  email: string
  role: 'admin' | 'editor'
}) => {
  adminStore.addAdmin({
    id: Date.now(),
    ...adminData,
  })

  router.push('/dashboard/admins')
}
</script>

<template>
  <div>
    <h1 class="text-xl font-bold mb-6">افزودن ادمین جدید</h1>

    <AdminForm @submit="handleSubmit" />
  </div>
</template>
