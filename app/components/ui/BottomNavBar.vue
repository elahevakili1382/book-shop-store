<template>
  <motion.nav
    role="navigation"
    aria-label="منوی پایین"
    :initial="reduceMotion ? false : { scale: 0.94, opacity: 0, y: 12 }"
    :animate="{ scale: 1, opacity: 1, y: 0 }"
    :transition="{ type: 'spring', stiffness: 300, damping: 26 }"
    :class="
      cn(
        'flex h-[52px] max-w-[95vw] items-center gap-1 rounded-full border border-slate/10 bg-white p-1.5 shadow-card',
        stickyBottom &&
          'fixed inset-x-0 bottom-[max(1rem,env(safe-area-inset-bottom))] z-40 mx-auto w-fit md:hidden',
        className
      )
    "
  >
    <NuxtLink
      v-for="item in items"
      :key="item.to"
      :to="item.to"
      :aria-label="item.label"
      :aria-current="isActive(item) ? 'page' : undefined"
      :class="
        cn(
          'relative flex h-10 min-h-[40px] min-w-[44px] max-h-[44px] items-center rounded-full px-3 transition-colors duration-200',
          isActive(item)
            ? 'bg-lime text-slate'
            : 'bg-transparent text-slate/50 hover:bg-cream hover:text-slate'
        )
      "
    >
      <component :is="item.icon" :size="22" :stroke-width="2" aria-hidden="true" class="shrink-0" />

      <span
        v-if="item.badge"
        class="absolute -top-0.5 left-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-slate px-1 text-[10px] font-bold text-white"
      >
        {{ Number(item.badge).toLocaleString('fa-IR') }}
      </span>

      <motion.span
        :initial="false"
        :animate="{
          width: isActive(item) ? `${LABEL_WIDTH}px` : '0px',
          opacity: isActive(item) ? 1 : 0,
          marginInlineStart: isActive(item) ? '8px' : '0px',
        }"
        :transition="{
          width: { type: 'spring', stiffness: 350, damping: 32 },
          opacity: { duration: 0.18 },
          marginInlineStart: { duration: 0.18 },
        }"
        class="overflow-hidden whitespace-nowrap text-xs font-bold"
      >
        {{ item.label }}
      </motion.span>
    </NuxtLink>
  </motion.nav>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { motion } from 'motion-v'
import { Heart, Home, ShoppingBag, User } from 'lucide-vue-next'
import { cn } from '~/lib/utils'
import { useAuthStore } from '../../stores/authStore'
import { useCartStore } from '../../stores/cart'
import { useWishlistStore } from '../../stores/wishlist'

const LABEL_WIDTH = 56

const props = withDefaults(
  defineProps<{
    className?: string
    stickyBottom?: boolean
  }>(),
  { stickyBottom: true }
)

const className = computed(() => props.className)
const stickyBottom = computed(() => props.stickyBottom)

const route = useRoute()
const auth = useAuthStore()
const cart = useCartStore()
const wishlist = useWishlistStore()

const reduceMotion = ref(false)
onMounted(() => {
  reduceMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
})

const accountTo = computed(() =>
  auth.isAuthenticated ? '/account' : '/login?redirect=/account',
)

const items = computed(() => [
  { label: 'خانه', to: '/', icon: Home, match: (path: string) => path === '/' },
  {
    label: 'علاقه‌ها',
    to: '/wishlist',
    icon: Heart,
    badge: wishlist.count > 0 ? wishlist.count : 0,
    match: (path: string) => path.startsWith('/wishlist'),
  },
  {
    label: 'سبد',
    to: '/cart',
    icon: ShoppingBag,
    badge: cart.cartCount > 0 ? cart.cartCount : 0,
    match: (path: string) => path.startsWith('/cart') || path.startsWith('/payment'),
  },
  {
    label: 'پنل',
    to: accountTo.value,
    icon: User,
    match: (path: string) =>
      path.startsWith('/account') || path.startsWith('/login'),
  },
])

function isActive(item: { match: (path: string) => boolean }) {
  return item.match(route.path)
}
</script>
