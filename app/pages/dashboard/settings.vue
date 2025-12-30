<template>
  <div class="space-y-6">
    <h1 class="text-2xl font-semibold">تنظیمات</h1>

    <UserProfileCard />
    <AppSettingsCard />
  </div>
</template>
<script setup lang="ts">
  import {computed, onMounted} from 'vue';
import UserProfileCard from '../../components/dashboard/UserProfileCard.vue'
  
</script>
