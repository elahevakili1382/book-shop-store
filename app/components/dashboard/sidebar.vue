<template>
  <div class="h-full flex flex-col rtl p-5">
    <div class="flex items-center justify-center py-5">
      <NuxtImg src="/images/brandlogo.png" alt="Logo" class="h-12 w-auto object-contain" />
    </div>

    <nav class="flex-1 p-2 space-y-1.5 overflow-y-auto">
      <NuxtLink
        v-for="item in menu"
        :key="item.label"
        :to="item.to"
        class="flex items-center gap-3 px-3 py-2.5 rounded-xl transition font-semibold text-base"
        :class="
          $route.path === item.to
            ? 'bg-[#DCF763]/15 text-[#DCF763]'
            : 'text-[#A8A29E] hover:text-[#F5F2EB] hover:bg-[#2A2D36]/60'
        "
      >
        <component
          :is="item.icon"
          class="w-5 h-5 shrink-0"
          :class="$route.path === item.to ? 'text-[#DCF763]' : 'text-[#A8A29E]'"
        />
        <span>{{ item.label }}</span>
      </NuxtLink>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { Home } from 'lucide-vue-next'

interface MenuItem {
  label: string
  to: string
  icon: any
}

const menu: MenuItem[] = [
  { label: 'داشبورد', to: '/dashboard', icon: Home },
]
</script>

<style scoped>
.rtl {
  direction: rtl;
}
</style>
