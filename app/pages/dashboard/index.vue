<!-- pages/dashboard/index.vue -->
<template>
  <div class="space-y-5">
    <ProgressCard />

    <div class="grid grid-cols-1 gap-4 xl:grid-cols-3">
      <div class="xl:col-span-2">
        <ProjectAnalytics />
      </div>
      <RevenueSummary />
    </div>

    <DetailTable />

    <div class="grid grid-cols-1 gap-4 xl:grid-cols-2">
      <RecentReviews />
      <div class="space-y-4">
        <CategoryChart />
        <div class="hidden lg:block">
          <UserRegistrationChart />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ProgressCard from '../../components/dashboard/ProgressCard.vue'
import ProjectAnalytics from '../../components/dashboard/ProjectAnalytics.vue'
import RevenueSummary from '../../components/dashboard/RevenueSummary.vue'
import DetailTable from '../../components/dashboard/DetailTable.vue'
import RecentReviews from '../../components/dashboard/RecentReviews.vue'
import CategoryChart from '../../components/dashboard/CategoryChart.vue'
import UserRegistrationChart from '../../components/dashboard/UserRegistrationChart.vue'

definePageMeta({
  title: 'خانه',
  layout: 'dashboard',
})

useSeoMeta({
  title: 'داشبورد',
})
</script>
