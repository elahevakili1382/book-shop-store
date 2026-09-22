<template>
  <nav
    class="fixed inset-x-0 bottom-0 z-40 border-t border-dash-border bg-dash-card/95 backdrop-blur-md lg:hidden"
    style="padding-bottom: env(safe-area-inset-bottom)"
    aria-label="منوی داشبورد"
  >
    <ul class="grid grid-cols-4">
      <li v-for="item in tabs" :key="item.key">
        <NuxtLink
          v-if="item.to"
          :to="item.to"
          :aria-current="isTabActive(item) ? 'page' : undefined"
          class="flex min-h-14 flex-col items-center justify-center gap-0.5 text-[11px] font-bold"
          :class="isTabActive(item) ? 'text-dash-accent' : 'text-dash-muted'"
        >
          <component :is="item.icon" class="h-5 w-5" />
          {{ item.label }}
        </NuxtLink>
        <button
          v-else
          type="button"
          class="flex min-h-14 w-full flex-col items-center justify-center gap-0.5 text-[11px] font-bold"
          :class="isMoreActive ? 'text-dash-accent' : 'text-dash-muted'"
          @click="$emit('more')"
        >
          <component :is="item.icon" class="h-5 w-5" />
          {{ item.label }}
        </button>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { Home, Package, ShoppingBag, Menu } from 'lucide-vue-next'

defineEmits<{ more: [] }>()

const route = useRoute()

const tabs = [
  { key: 'home', label: 'خانه', to: '/dashboard', icon: Home },
  { key: 'orders', label: 'سفارش', to: '/dashboard/orders', icon: ShoppingBag },
  { key: 'products', label: 'کتاب', to: '/dashboard/products', icon: Package },
  { key: 'more', label: 'بیشتر', to: '', icon: Menu },
]

const morePaths = ['/dashboard/users', '/dashboard/admins', '/dashboard/settings', '/dashboard/invoice']

const isMoreActive = computed(() => morePaths.some((p) => route.path === p || route.path.startsWith(`${p}/`)))

function isTabActive(item: (typeof tabs)[number]) {
  if (!item.to) return isMoreActive.value
  if (item.to === '/dashboard') return route.path === '/dashboard'
  return route.path === item.to || route.path.startsWith(`${item.to}/`)
}
</script>
