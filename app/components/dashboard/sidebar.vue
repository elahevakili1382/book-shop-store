<template>
  <aside class="w-64 bg-white m-5 rounded-xl text-primary shadow-lg h-auto flex flex-col rtl flex-shrink-0">
    <!-- لوگو -->
    <div class="flex items-center justify-center py-5">
      <NuxtImg src="/images/brandlogo.png" alt="Logo" class="h-12 w-auto object-contain" />
    </div>

    <!-- منو -->
    <nav class="flex-1 p-4 space-y-2 overflow-y-auto">
      <NuxtLink
        v-for="item in menu"
        :key="item.label"
        :to="item.to"
        class="flex items-center gap-3 px-3 py-2 rounded-lg transition font-semibold text-xl"
        :class="$route.path === item.to ? 'text-blue-700' : 'text-black hover:text-blue-700'"
      >
        <component :is="item.icon" class="w-5 h-5 font-bolder text-2xl text-blue-800" />
        <span>{{ item.label }}</span>
      </NuxtLink>
    </nav>
  </aside>
</template>

<script lang="ts" setup>
import { Home, BarChart, Users, Settings } from 'lucide-vue-next';

const menu = [
  { label: 'خانه', to: '/dashboard', icon: Home },
  { label: 'تحلیل‌ها', to: '/dashboard', icon: BarChart },
  { label: 'تیم', to: '/dashboard', icon: Users },
  { label: 'تنظیمات', to: '/dashboard', icon: Settings },
];
</script>

<style scoped>
.rtl {
  direction: rtl;
}
</style>
