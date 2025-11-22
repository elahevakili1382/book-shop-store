<!-- pages/dashboard/index.vue -->
<template>
  <div class="space-y-8"> 
    <!-- 🔹 بخش کارت‌های بالایی -->
    <ProgressCard />

    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-5">
      <!-- کارت دو سوم -->
      <div class="md:col-span-2">
        <ProjectAnalytics title="Total Projects" value="24" growth="+12%" />
      </div>

      <!-- کارت یک سوم -->
      <div class="md:col-span-1 flex flex-col gap-5">
        <!-- کارت یادآوری -->
        <div
          class="bg-white rounded-2xl shadow p-6 flex flex-col justify-between 
                 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl"
        >
          <div>
            <h3 class="text-lg font-semibold text-gray-800 mb-3">یادآوری</h3>
            <h2 class="text-gray-700 text-xl font-bold leading-snug">
              قرار آنلاین با شرکت آرسی
            </h2>
            <p class="text-sm text-gray-500 mt-1">۲:۰۰ ظهر - ۴:۰۰ عصر</p>
          </div>

          <button
            class="flex items-center justify-center gap-2 mt-6 bg-[#2408af] text-white px-3 py-3 rounded-full text-lg font-medium hover:bg-[#261A7F] transition"
          >
            <FontAwesome :icon="['fas', 'camera']" class="w-4 h-4 text-white" />
            شروع ملاقات
          </button>
        </div>

        <!-- لیست پروژه‌ها -->
               <TimeTracker />

      </div>
    </div>

    <!-- 🔹 بخش سه کارت پایین -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-5 px-2 sm:px-4">
      <TeamCollaboration />
      <ProjectProgress />
      <ProjectsList />

    </div>
    
  </div>
</template>

<script setup lang="ts">
import TeamCollaboration from '~/components/dashboard/TeamCollaboration.vue';
import ProjectAnalytics from '~/components/dashboard/ProjectAnalytics.vue';
import ProjectProgress from '~/components/dashboard/ProjectProgress.vue';
import TimeTracker from '~/components/dashboard/TimeTracker.vue';
import ProjectsList from '~/components/dashboard/ProjectsList.vue'
import ProgressCard from '~/components/dashboard/progress_card_tmp.vue';


definePageMeta({
  title: 'داشبورد ادمین',
  layout: 'dashboard',
})
</script>
