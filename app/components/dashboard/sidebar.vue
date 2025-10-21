<template>
  <aside class="w-64 bg-white text-primary shadow-lg h-screen flex flex-col rtl flex-shrink-0">
    <!-- لوگو -->
    <div class="flex items-center justify-center py-6 border-b border-blue-800">
      <NuxtImg src="/images/brandlogo.png" alt="Logo" class="h-12 w-auto object-contain" />
    </div>

    <!-- منو -->
    <nav class="flex-1 p-4 space-y-2 overflow-y-auto">
      <NuxtLink
        v-for="item in menu"
        :key="item.label"
        :to="item.to"
        class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-blue-600 hover:text-white transition font-semibold"
        :class="{'bg-blue-700 text-white': $route.path === item.to}"
      >
        <component :is="item.icon" class="w-5 h-5 font-bold text-blue-800" />
        <span>{{ item.label }}</span>
      </NuxtLink>
    </nav>
  </aside>
</template>

<script lang="ts" setup>
import { Home, BarChart, Users, Settings } from 'lucide-vue-next';

const menu = [
  { label: 'خانه', to: '/dashboard', icon: Home },
  { label: 'تحلیل‌ها', to: '/dashboard/analytics', icon: BarChart },
  { label: 'تیم', to: '/dashboard/team', icon: Users },
  { label: 'تنظیمات', to: '/dashboard/settings', icon: Settings },
];
</script>

<style scoped>
.rtl {
  direction: rtl;
}
</style>
