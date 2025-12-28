<template>
  <div class="h-full flex flex-col rtl p-5">
    <!-- logo -->
    <div class="flex items-center justify-center py-5">
      <NuxtImg
        src="/images/brandlogo.png"
        alt="Logo"
        class="h-12 w-auto object-contain"
      />
    </div>

    <!-- menu -->
    <nav class="flex-1 p-4 space-y-2 overflow-y-auto">
      <NuxtLink
        v-for="item in menu"
        :key="item.label"
        :to="item.to"
        class="flex items-center gap-3 px-3 py-2 rounded-lg transition font-semibold text-lg"
        :class="$route.path === item.to
          ? 'text-blue-700 bg-blue-50'
          : 'text-black hover:text-blue-700 hover:bg-gray-100'"
      >
        <component :is="item.icon" class="w-5 h-5 text-blue-800" />
        <span>{{ item.label }}</span>
      </NuxtLink>
    </nav>
  </div>
</template>


<script setup lang="ts">
import { Home, BarChart, Users, Settings } from 'lucide-vue-next'

interface MenuItem {
  label: string
  to: string
  icon: any
}

const menu: MenuItem[] = [
  { label: 'داشبورد', to: '/dashboard', icon: Home },
  { label: 'سفارش‌ها', to: '/dashboard/invoice', icon: BarChart },
  { label: 'محصولات', to: '/dashboard/products', icon: Users },
  { label: 'تنظیمات', to: '/dashboard/settings', icon: Settings },
]
</script>

<style scoped>
.rtl {
  direction: rtl;
}
</style>
