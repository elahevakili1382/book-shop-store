<template>
    <aside class="w-64 bg-grayP shadow-md h-screen flex flex-col fixed">
         <div class="flex items-center justify-center py-6 border-b">
      <NuxtImg src="/images/brandlogo.png" alt="Logo" width="120" height="40" />
    </div>

    <nav class="flex-1 p-4 space-y-2 overflow-y-auto">
        <NuxtLink v-for="item in menu" :key="item.label" :to="item.to" class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition "
        :class="{'bg-gray-100 text-primary':$route.path === item.to }"
        >
        <component :is="item.icon" class="w-5 h-5 "/>
        <span>{{ item.label }}</span>
    
    </NuxtLink>
    </nav>
    </aside>
</template>
<script lang="ts" setup>
import{Home, BarChart, Users, Settings } from 'lucide-vue-next'
const menu = [
    {label:'خانه', to:'/dashboard', icon:Home},
    {label:'تحلیل ها', to:'/dashboard/analytics', icon:BarChart},
    {label:'تیم', to:'/dashboard/team', icon:Users},
    {label:'تنظیمات', to:'/dashboard/settings', icon:Settings }
]
</script>
<style scoped>
aside{
    direction: rtl;
}
</style>