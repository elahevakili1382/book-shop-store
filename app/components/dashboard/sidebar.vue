<template>
  <div class="flex h-full flex-col p-5">
    <div class="flex items-center justify-center py-5">
      <NuxtImg src="/images/brandlogo.png" alt="Logo" class="h-12 w-auto object-contain brightness-0 invert" />
    </div>

    <nav class="flex-1 space-y-1.5 overflow-y-auto p-2">
      <NuxtLink
        v-for="item in menu"
        :key="item.label"
        :to="item.to"
        class="flex items-center gap-3 rounded-xl px-3 py-2.5 text-base font-semibold transition"
        :class="
          isActive(item.to)
            ? 'bg-[#DCF763]/15 text-[#DCF763]'
            : 'text-[#A8A29E] hover:bg-[#2A2D36]/60 hover:text-[#F5F2EB]'
        "
      >
        <component
          :is="item.icon"
          class="h-5 w-5 shrink-0"
          :class="isActive(item.to) ? 'text-[#DCF763]' : 'text-[#A8A29E]'"
        />
        <span>{{ item.label }}</span>
      </NuxtLink>
    </nav>

    <button
      type="button"
      class="mt-2 flex items-center gap-3 rounded-xl px-3 py-2.5 text-right text-base font-semibold text-[#A8A29E] transition hover:bg-rose-400/10 hover:text-rose-300"
      @click="auth.logout()"
    >
      <LogOut class="h-5 w-5 shrink-0" />
      خروج
    </button>
  </div>
</template>

<script setup lang="ts">
import { Home, FileText, Package, ShoppingBag, Users, Shield, Settings, LogOut } from 'lucide-vue-next'

interface MenuItem {
  label: string
  to: string
  icon: any
}

const route = useRoute()
const auth = useAuthStore()

const menu: MenuItem[] = [
  { label: 'داشبورد', to: '/dashboard', icon: Home },
  { label: 'محصولات', to: '/dashboard/products', icon: Package },
  { label: 'سفارشات', to: '/dashboard/orders', icon: ShoppingBag },
  { label: 'فاکتورها', to: '/dashboard/invoice', icon: FileText },
  { label: 'کاربران', to: '/dashboard/users', icon: Users },
  { label: 'ادمین‌ها', to: '/dashboard/admins', icon: Shield },
  { label: 'تنظیمات', to: '/dashboard/settings', icon: Settings },
]

function isActive(to: string) {
  if (to === '/dashboard') return route.path === '/dashboard'
  return route.path === to || route.path.startsWith(`${to}/`)
}
</script>
