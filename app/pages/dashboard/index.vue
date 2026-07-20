<!-- pages/dashboard/index.vue -->
<template>
  <div class="space-y-8">
    <!-- 🔹 بخش کارت‌های بالایی -->
    <ProgressCard />
    <ProjectAnalytics />
    <DetailTable />

  </div>


</template>

<script setup lang="ts">

import ProgressCard from '../../components/dashboard/ProgressCard.vue';
import ProjectAnalytics from '../../components/dashboard/ProjectAnalytics.vue';
import DetailTable from '../../components/dashboard/DetailTable.vue';


definePageMeta({
  title: 'داشبورد ادمین',
  layout: 'dashboard',
})
</script>
