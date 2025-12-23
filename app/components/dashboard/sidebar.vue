<template>
  <div class="relative flex" ref="sidebarWrapper">
    <aside
      class="bg-white m-5 rounded-xl text-primary shadow-lg h-auto flex flex-col rtl flex-shrink-0 transition-all duration-300"
      :class="isOpen ? 'w-64' : 'w-20'"
    >
      <div class="flex items-center justify-center py-5">
        <NuxtImg
          v-if="isOpen"
          src="/images/brandlogo.png"
          alt="Logo"
          class="h-12 w-auto object-contain cursor-pointer"
          @click.stop="toggleSidebar"
        />
        <svg
          v-else
          @click.stop="toggleSidebar"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          class="h-8 w-8 text-blue-700 cursor-pointer"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M3 7h18M3 12h18M3 17h18"
          />
        </svg>
      </div>

      <nav class="flex-1 p-4 space-y-2 overflow-y-auto">
        <NuxtLink
          v-for="item in menu"
          :key="item.label"
          :to="item.to"
          class="flex items-center gap-3 px-3 py-2 rounded-lg transition font-semibold text-lg"
          :class="$route.path === item.to ? 'text-blue-700' : 'text-black hover:text-blue-700'"
        >
          <component :is="item.icon" class="w-5 h-5 text-blue-800" />
          <span v-if="isOpen">{{ item.label }}</span>
        </NuxtLink>
      </nav>
    </aside>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { Home, BarChart, Users, Settings } from 'lucide-vue-next'

interface MenuItem {
  label: string
  to: string
  icon: any
}

const isOpen = ref(true)
const sidebarWrapper = ref<HTMLElement | null>(null)

const toggleSidebar = () => {
  isOpen.value = !isOpen.value
}

const handleClickOutside = (event: MouseEvent) => {
  if (isOpen.value && sidebarWrapper.value && !sidebarWrapper.value.contains(event.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})
onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})

const menu: MenuItem[] = [
  { label: 'داشبورد', to: '/dashboard', icon: Home },
  { label: 'سفارش ها', to: '/dashboard/invoice', icon: BarChart },
  { label: 'محصولات', to: '/dashboard/products', icon: Users },
  { label: 'تنظیمات', to: '/dashboard/', icon: Settings },
]
</script>

<style scoped>
.rtl {
  direction: rtl;
}
</style>
