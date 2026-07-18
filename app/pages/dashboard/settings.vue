<template>
  <div class="space-y-6">
    <h1 class="text-2xl font-semibold">تنظیمات</h1>
<AdminProfile
    @update="onUpdateProfile"
    @delete="onDeleteProfile"
  />
    
  </div>
</template>



<script setup lang="ts">
import AdminProfile from '../../components/dashboard/AdminProfile.vue';
import type { AdminProfile as AdminProfileType } from '../../components/dashboard/AdminProfile.vue';
definePageMeta({
  title:'تنظیمات',
  layout:'dashboard'
})

const onUpdateProfile = (profile:AdminProfileType) => {
  console.log('UPDATED PROFILE:', profile);
}

const onDeleteProfile = (id: string) => {
  console.log('DELETE PROFILE ID:', id)
}

</script>
