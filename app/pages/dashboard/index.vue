<!-- pages/dashboard/index.vue -->
<template>
  <progressCard />
  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-5">
  <!-- کارت دو سوم -->
  <div class="md:col-span-2">
    <ProjectAnalytics title="Total Projects" value="24" growth="+12%" />
  </div>

  <!-- کارت یک سوم -->
  <div class="md:col-span-1">
    <!-- میتونی کارت دیگه یا Reminder اینجا بذاری -->
    <div class="bg-white rounded-2xl shadow p-6 mt-8 flex flex-col justify-between">
      <div>
            <h3 class="text-lg font-semibold text-gray-800 mb-3">یادآوری</h3>
                <h2 class="text-gray-700 text-xl font-bold leading-snug">قرار آنلاین با شرکت آرسی</h2>
                    <p class="text-sm text-gray-500 mt-1">۲:۰۰ ظهر - ۴:۰۰ عصر</p>

      </div>

      <button
    class="flex items-center justify-center gap-2 mt-6 bg-[#2408af] text-white px-2 py-3 rounded-full text-lg
     font-medium hover:bg-[#261A7F] transition"
  >
    <FontAwesome :icon="['fas', 'camera']" class="w-4 h-4 text-white" />
    شروع ملاقات
  </button>
    </div>
    <projectsList/>
  </div>
  
  <!-- ستون اول: تیم -->
  <div class="col-span-1">
    <TeamCollaboration />
  </div>

  <!-- ستون دوم: پراگرس -->
  <div class="col-span-1">
    <ProjectProgress />
  </div>
  <div class="col-span-1">
    <TimeTracker />
  </div>
</div>





  
  
</template>

<script setup lang="ts">
import ProjectAnalytics from '~/components/dashboard/ProjectAnalytics.vue'
import progressCard from '~/components/dashboard/progressCard.vue';
import projectsList from '~/components/dashboard/projectsList.vue';
import TeamCollaboration from '~/components/dashboard/TeamCollaboration.vue';
import ProjectProgress from '~/components/dashboard/ProjectProgress.vue';
import TimeTracker from '~/components/dashboard/TimeTracker.vue';


definePageMeta({
  title:'داشبورد ادمین',
  layout: 'dashboard',
});
</script>
