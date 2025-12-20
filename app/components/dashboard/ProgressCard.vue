<template>
      <div class="space-y-6">
    <h2 class="text-2xl font-bold text-gray-800">داشبورد ادمین 🆔</h2>

   <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">

        <div v-for="item in dashboardCards" :key="item.label"  class="rounded-2xl shadow-md p-6 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800
              text-white   transition-all duration-500 transform 
         hover:-translate-y-2 hover:scale-[1.03] 
         hover:shadow-[0_10px_25px_rgba(37,99,235,0.35)]">

              <h3 class="font-medium mb-2">{{ item.label }}</h3>
              <h3 class="text-3xl font-bold">{{ item.value }}</h3>
            
            </div>

      
  </div>
  </div>

</template>
<script lang="ts" setup>
import { useDashboardStore } from '../../stores/dashboard';
const dashboardStore = useDashboardStore()
dashboardStore.fetchDashboardData()


const dashboardCards = computed(() => [
  {label:'تعداد کتاب ها' , value:dashboardStore.totalSales.toFixed(0)},
  {label:'کاربران فعال' , value:dashboardStore.totalUsers},
  {label:'سفارشات امروز' , value:dashboardStore.products.length},
  {label:'تنظیمات' , value:5},
])
</script>