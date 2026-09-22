<template>
  <div class="flex h-full flex-col px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-6">
    <div class="mb-6 px-2">
      <p class="text-lg font-black text-dash-text">Booklett</p>
      <p class="mt-0.5 text-xs text-dash-muted">پنل مدیریت</p>
    </div>

    <nav class="flex-1 space-y-1 overflow-y-auto" aria-label="بخش‌های داشبورد">
      <NuxtLink
        v-for="item in menu"
        :key="item.label"
        :to="item.to"
        class="flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-bold transition"
        :class="
          isActive(item.to)
            ? 'bg-dash-accent/15 text-dash-accent'
            : 'text-dash-muted hover:bg-dash-bg hover:text-dash-text'
        "
      >
        <component
          :is="item.icon"
          class="h-5 w-5 shrink-0"
        />
        <span>{{ item.label }}</span>
      </NuxtLink>
    </nav>

    <button
      type="button"
      class="mt-2 flex min-h-11 items-center gap-3 rounded-xl px-3 text-right text-sm font-bold text-dash-muted hover:bg-rose-400/10 hover:text-rose-300"
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
  { label: 'خانه', to: '/dashboard', icon: Home },
  { label: 'محصولات', to: '/dashboard/products', icon: Package },
  { label: 'سفارشات', to: '/dashboard/orders', icon: ShoppingBag },
  { label: 'فاکتورها', to: '/dashboard/invoice', icon: FileText },
  { label: 'مشتریان', to: '/dashboard/users', icon: Users },
  { label: 'ادمین‌ها', to: '/dashboard/admins', icon: Shield },
  { label: 'تنظیمات', to: '/dashboard/settings', icon: Settings },
]

function isActive(to: string) {
  if (to === '/dashboard') return route.path === '/dashboard'
  return route.path === to || route.path.startsWith(`${to}/`)
}
</script>
