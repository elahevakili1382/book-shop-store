<!-- pages/dashboard/index.vue -->
<template>
  <progressCard />


  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-6 mb-8">
  <!-- کارت دو سوم -->
  <div class="col-span-2">
    <ProjectAnalytics title="Total Projects" value="24" growth="+12%" />
  </div>

  <!-- کارت یک سوم -->
  <div class="col-span-1">
    <!-- میتونی کارت دیگه یا Reminder اینجا بذاری -->
    <div class="bg-white rounded-xl shadow p-6 mt-8">
      <h3 class="text-lg font-medium mb-2">Reminders</h3>
      <p class="text-gray-500">Meeting with Arc Company</p>
      <p class="text-sm text-gray-400">2:00 pm - 4:00 pm</p>
      <button class="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700">
        Start Meeting
      </button>
    </div>
  </div>
</div>


  
  
</template>

<script setup lang="ts">
import ProjectAnalytics from '~/components/dashboard/ProjectAnalytics.vue'
import progressCard from '~/components/dashboard/progressCard.vue';


definePageMeta({
  title:'داشبورد ادمین',
  layout: 'dashboard',
});
</script>
