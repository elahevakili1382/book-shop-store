<template>
  <main class="cart-page bg-cream min-h-screen overflow-x-hidden">
    <div class="relative max-w-[1120px] mx-auto px-4 sm:px-8 pt-8 sm:pt-12 pb-28 lg:pb-16">
      <!-- soft atmosphere -->
      <div class="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div class="absolute -top-24 -left-20 w-[380px] h-[380px] rounded-full bg-lime/20 blur-3xl" />
        <div class="absolute top-1/3 -right-24 w-[320px] h-[320px] rounded-full bg-slate/5 blur-3xl" />
      </div>

      <ClientOnly>
        <motion.header
          :initial="{ opacity: 0, y: 18 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.5, ease: easeOut }"
          class="relative z-10 mb-8 sm:mb-10"
        >
          <nav class="flex items-center gap-1.5 text-xs text-slate/45 mb-4">
            <NuxtLink to="/" class="hover:text-slate transition-colors">خانه</NuxtLink>
            <AppIcon icon="mdi:chevron-left" class="w-3.5 h-3.5 shrink-0" />
            <span class="text-slate/70">سبد خرید</span>
          </nav>

          <div class="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 class="text-3xl sm:text-4xl font-black text-slate tracking-tight leading-none">
                سبد خرید
              </h1>
              <p class="mt-2 text-sm text-slate/50">
                <template v-if="cart.cartCount">
                  {{ cart.cartCount.toLocaleString('fa-IR') }} کتاب در سبد شماست
                </template>
                <template v-else>
                  هنوز چیزی انتخاب نکرده‌اید
                </template>
              </p>
            </div>

            <NuxtLink
              v-if="cart.cartItems.length"
              to="/new"
              class="inline-flex items-center gap-1.5 text-sm font-semibold text-slate/55 hover:text-slate transition-colors"
            >
              <AppIcon icon="mdi:arrow-right" class="w-4 h-4" />
              ادامه خرید
            </NuxtLink>
          </div>
        </motion.header>

        <!-- empty state -->
        <motion.div
          v-if="!cart.cartItems.length"
          key="empty"
          :initial="{ opacity: 0, y: 24 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.55, ease: easeOut }"
          class="relative z-10 flex flex-col items-center text-center py-16 sm:py-24"
        >
          <div
            class="w-24 h-24 rounded-full bg-white border border-slate/8 shadow-card
                   flex items-center justify-center mb-6"
          >
            <AppIcon icon="mdi:cart-outline" class="w-10 h-10 text-slate/30" />
          </div>
          <h2 class="text-xl font-bold text-slate mb-2">سبد خرید خالی است</h2>
          <p class="text-sm text-slate/50 max-w-sm mb-8 leading-relaxed">
            کتاب‌های مورد علاقه‌ات را پیدا کن و به سبد اضافه کن تا از اینجا سفارش را نهایی کنی.
          </p>
          <motion.div :while-hover="{ scale: 1.02 }" :while-tap="{ scale: 0.98 }">
            <NuxtLink
              to="/new"
              class="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-slate text-white
                     font-bold text-sm shadow-card hover:bg-lime hover:text-slate transition-colors"
            >
              <AppIcon icon="mdi:book-open-page-variant-outline" class="w-5 h-5" />
              مشاهده کتاب‌ها
            </NuxtLink>
          </motion.div>
        </motion.div>

        <!-- filled cart -->
        <div
          v-else
          key="filled"
          class="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start"
        >
          <!-- items -->
          <div class="lg:col-span-7 xl:col-span-8 space-y-3">
            <AnimatePresence>
            <motion.article
              v-for="(item, index) in cart.cartItems"
              :key="item.uniqueId"
              :initial="{ opacity: 0, y: 20 }"
              :animate="{ opacity: 1, y: 0 }"
              :exit="{ opacity: 0, x: 48, scale: 0.98 }"
              :transition="{ duration: 0.4, delay: Math.min(index * 0.06, 0.3), ease: easeOut }"
              :layout="true"
              class="group relative flex gap-4 sm:gap-5 p-4 sm:p-5 rounded-[1.35rem]
                     bg-white border border-slate/8 shadow-card
                     hover:shadow-card-hover hover:border-slate/12 transition-shadow"
            >
              <div
                class="shrink-0 w-[88px] sm:w-[104px] aspect-[3/4] rounded-2xl overflow-hidden
                       bg-cream border border-slate/6"
              >
                <NuxtImg
                  v-if="item.image"
                  :src="item.image"
                  :alt="item.name"
                  class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  width="120"
                  height="160"
                  format="webp"
                  loading="lazy"
                />
                <div
                  v-else
                  class="w-full h-full flex items-center justify-center text-slate/25"
                >
                  <AppIcon icon="mdi:book-outline" class="w-8 h-8" />
                </div>
              </div>

              <div class="flex-1 min-w-0 flex flex-col">
                <div class="flex items-start justify-between gap-3">
                  <div class="min-w-0">
                    <h2 class="font-bold text-slate text-[15px] sm:text-base leading-snug line-clamp-2">
                      {{ item.name }}
                    </h2>
                    <p class="mt-1.5 text-sm text-slate/45">
                      {{ formatPrice(item.price) }}
                      <span class="text-slate/30">تومان</span>
                    </p>
                  </div>

                  <motion.button
                    type="button"
                    aria-label="حذف از سبد"
                    :while-hover="{ scale: 1.08 }"
                    :while-tap="{ scale: 0.92 }"
                    class="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center
                           text-slate/35 hover:text-red-500 hover:bg-red-50 transition-colors"
                    @click="removeItem(item.uniqueId)"
                  >
                    <AppIcon icon="mdi:trash-can-outline" class="w-4 h-4" />
                  </motion.button>
                </div>

                <div class="mt-auto pt-4 flex flex-wrap items-center justify-between gap-3">
                  <div
                    class="inline-flex items-center gap-1 rounded-full bg-cream border border-slate/10 p-1"
                  >
                    <motion.button
                      type="button"
                      aria-label="کاهش تعداد"
                      :while-tap="{ scale: 0.9 }"
                      class="w-8 h-8 rounded-full flex items-center justify-center
                             text-slate hover:bg-white transition-colors"
                      @click="cart.updateQuantity(item.uniqueId, item.quantity - 1)"
                    >
                      <AppIcon
                        :icon="item.quantity <= 1 ? 'mdi:trash-can-outline' : 'mdi:minus'"
                        class="w-4 h-4"
                        :class="item.quantity <= 1 ? 'text-red-400' : ''"
                      />
                    </motion.button>

                    <span class="w-8 text-center text-sm font-bold text-slate tabular-nums">
                      {{ item.quantity.toLocaleString('fa-IR') }}
                    </span>

                    <motion.button
                      type="button"
                      aria-label="افزایش تعداد"
                      :while-tap="{ scale: 0.9 }"
                      class="w-8 h-8 rounded-full flex items-center justify-center
                             text-slate hover:bg-white transition-colors"
                      @click="cart.updateQuantity(item.uniqueId, item.quantity + 1)"
                    >
                      <AppIcon icon="mdi:plus" class="w-4 h-4" />
                    </motion.button>
                  </div>

                  <p class="text-base sm:text-lg font-black text-slate tabular-nums">
                    {{ formatPrice(item.price * item.quantity) }}
                    <span class="text-xs font-bold text-slate/40 mr-0.5">تومان</span>
                  </p>
                </div>
              </div>
            </motion.article>
            </AnimatePresence>

            <motion.button
              v-if="cart.cartItems.length > 1"
              type="button"
              :initial="{ opacity: 0 }"
              :animate="{ opacity: 1 }"
              :transition="{ delay: 0.35 }"
              class="text-xs font-semibold text-slate/40 hover:text-red-500 transition-colors px-1 pt-1"
              @click="clearAll"
            >
              خالی کردن سبد
            </motion.button>
          </div>

          <!-- summary -->
          <aside class="lg:col-span-5 xl:col-span-4">
            <motion.div
              :initial="{ opacity: 0, y: 24 }"
              :animate="{ opacity: 1, y: 0 }"
              :transition="{ duration: 0.55, delay: 0.12, ease: easeOut }"
              class="lg:sticky lg:top-24 space-y-4"
            >
              <div
                class="rounded-[1.5rem] bg-white border border-slate/8 shadow-card p-5 sm:p-6 space-y-5"
              >
                <div class="flex items-center justify-between">
                  <h2 class="text-lg font-black text-slate">خلاصه سفارش</h2>
                  <span
                    class="px-2.5 py-1 rounded-full bg-lime/40 text-slate text-[11px] font-bold"
                  >
                    {{ cart.cartCount.toLocaleString('fa-IR') }} قلم
                  </span>
                </div>

                <div class="space-y-3 text-sm">
                  <div class="flex items-center justify-between text-slate/60">
                    <span>جمع جزء</span>
                    <span class="font-semibold text-slate tabular-nums">
                      {{ formatPrice(cart.cartTotal) }} تومان
                    </span>
                  </div>
                  <div class="flex items-center justify-between text-slate/60">
                    <span>هزینه ارسال</span>
                    <span class="font-semibold text-emerald-600">محاسبه در مرحله بعد</span>
                  </div>
                  <div class="h-px bg-slate/8" />
                  <div class="flex items-center justify-between">
                    <span class="font-bold text-slate">مبلغ قابل پرداخت</span>
                    <span class="text-xl font-black text-slate tabular-nums">
                      {{ formatPrice(cart.cartTotal) }}
                      <span class="text-xs font-bold text-slate/40">تومان</span>
                    </span>
                  </div>
                </div>

                <!-- payment -->
                <div class="space-y-2.5">
                  <p class="text-xs font-bold text-slate/45">روش پرداخت</p>
                  <div class="grid grid-cols-1 gap-2">
                    <label
                      v-for="method in paymentMethods"
                      :key="method.value"
                      :class="[
                        'flex items-center gap-3 p-3 rounded-2xl border cursor-pointer transition-all',
                        payment === method.value
                          ? 'border-slate/25 bg-cream shadow-sm'
                          : 'border-slate/8 hover:border-slate/15 bg-white',
                      ]"
                    >
                      <input
                        v-model="payment"
                        type="radio"
                        name="payment"
                        :value="method.value"
                        class="sr-only"
                      />
                      <span
                        :class="[
                          'w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0',
                          payment === method.value ? 'border-slate' : 'border-slate/25',
                        ]"
                      >
                        <span
                          v-if="payment === method.value"
                          class="w-2 h-2 rounded-full bg-slate"
                        />
                      </span>
                      <span class="flex-1 text-sm font-semibold text-slate">{{ method.label }}</span>
                      <AppIcon :icon="method.icon" class="w-4 h-4 text-slate/35" />
                    </label>
                  </div>
                </div>

                <motion.button
                  type="button"
                  :while-hover="{ scale: 1.015 }"
                  :while-tap="{ scale: 0.985 }"
                  class="w-full py-3.5 rounded-2xl bg-slate text-white font-bold text-sm
                         flex items-center justify-center gap-2 shadow-card
                         hover:bg-lime hover:text-slate transition-colors"
                  @click="checkout"
                >
                  تایید و ادامه
                  <AppIcon icon="mdi:arrow-left" class="w-4 h-4" />
                </motion.button>

                <p class="text-[11px] leading-relaxed text-slate/40 text-center">
                  سفارش‌ها طی ۳ تا ۵ روز کاری ارسال می‌شوند. قبل از پرداخت نهایی، اطلاعات را بررسی کنید.
                </p>
              </div>

              <div
                class="hidden sm:flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/70
                       border border-slate/8 text-xs text-slate/50"
              >
                <AppIcon icon="mdi:shield-check-outline" class="w-5 h-5 text-slate/35 shrink-0" />
                پرداخت امن و امکان پیگیری سفارش پس از ثبت
              </div>
            </motion.div>
          </aside>
        </div>

        <template #fallback>
          <div class="relative z-10 py-20 flex justify-center">
            <div class="w-8 h-8 rounded-full border-2 border-slate/15 border-t-slate animate-spin" />
          </div>
        </template>
      </ClientOnly>
    </div>

    <!-- mobile sticky checkout -->
    <ClientOnly>
      <motion.div
        v-if="cart.cartItems.length"
        :initial="{ y: 80, opacity: 0 }"
        :animate="{ y: 0, opacity: 1 }"
        :transition="{ duration: 0.4, delay: 0.2 }"
        class="lg:hidden fixed bottom-0 inset-x-0 z-40 border-t border-slate/10
               bg-white/95 backdrop-blur-md px-4 py-3 safe-bottom"
      >
        <div class="max-w-[1120px] mx-auto flex items-center gap-3">
          <div class="min-w-0 flex-1">
            <p class="text-[11px] text-slate/45 font-medium">قابل پرداخت</p>
            <p class="text-base font-black text-slate tabular-nums truncate">
              {{ formatPrice(cart.cartTotal) }}
              <span class="text-[10px] font-bold text-slate/40">تومان</span>
            </p>
          </div>
          <motion.button
            type="button"
            :while-tap="{ scale: 0.97 }"
            class="shrink-0 px-6 py-3 rounded-2xl bg-slate text-white font-bold text-sm
                   hover:bg-lime hover:text-slate transition-colors"
            @click="checkout"
          >
            ادامه
          </motion.button>
        </div>
      </motion.div>
    </ClientOnly>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { AnimatePresence, motion } from 'motion-v'
import { useCartStore } from '../stores/cart'

definePageMeta({
  layout: 'default',
})

useSeoMeta({
  title: 'سبد خرید',
  description: 'مشاهده و مدیریت کتاب‌های سبد خرید و ادامه فرآیند سفارش.',
})

const cart = useCartStore()
const router = useRouter()

const easeOut = [0.22, 1, 0.36, 1] as const

const payment = ref<'online' | 'delivery'>('online')
const address = ref('')

const paymentMethods = [
  { value: 'online' as const, label: 'پرداخت آنلاین', icon: 'mdi:credit-card-outline' },
  { value: 'delivery' as const, label: 'پرداخت در محل', icon: 'mdi:cash-multiple' },
]

function formatPrice(value: number) {
  return new Intl.NumberFormat('fa-IR').format(value)
}

function removeItem(uniqueId: string) {
  cart.removeFromCart(uniqueId)
}

function clearAll() {
  cart.clearCart()
}

function checkout() {
  if (import.meta.client) {
    try {
      sessionStorage.setItem(
        'checkout',
        JSON.stringify({ payment: payment.value }),
      )
    } catch {
      /* ignore */
    }
  }
  router.push('/address')
}

onMounted(() => {
  cart.loadCart()
})
</script>

<style scoped>
.cart-page {
  direction: rtl;
}

.safe-bottom {
  padding-bottom: max(0.75rem, env(safe-area-inset-bottom));
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
