<template>
  <footer class="footer-root mt-16 bg-slate text-white">
    <div class="h-1 w-full bg-lime" aria-hidden="true" />
    <div class="mx-auto max-w-[1280px] px-4 py-10 pb-[calc(6.75rem+env(safe-area-inset-bottom))] sm:px-8 lg:py-14 lg:pb-14">
      <div class="grid grid-cols-1 gap-8 min-w-0 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
        <div class="min-w-0 text-right sm:col-span-2 lg:col-span-5">
          <NuxtLink to="/" class="inline-flex items-center">
            <span class="text-xl font-black tracking-tight">Booklett</span>
          </NuxtLink>
          <p class="mt-3 max-w-sm text-sm leading-relaxed text-white/65">
            فروشگاه آنلاین کتاب با جلد اصل، قیمت روی جلد و ارسال به سراسر کشور.
            از انتخاب کتاب تا پرداخت زرین‌پال، مسیر کوتاه است.
          </p>
          <ul class="mt-5 space-y-2.5 text-sm text-white/70">
            <li class="flex items-center gap-2">
              <AppIcon icon="mdi:email-outline" class="h-4 w-4 shrink-0 text-lime" />
              <a href="mailto:hello@booklett.ir" class="hover:text-lime">hello@booklett.ir</a>
            </li>
            <li class="flex items-center gap-2">
              <AppIcon icon="mdi:clock-outline" class="h-4 w-4 shrink-0 text-lime" />
              شنبه تا پنجشنبه، ۹ صبح تا ۹ شب
            </li>
            <li class="flex items-start gap-2">
              <AppIcon icon="mdi:map-marker-outline" class="mt-0.5 h-4 w-4 shrink-0 text-lime" />
              تهران، میدان انقلاب
            </li>
          </ul>
          <div class="mt-5 flex flex-wrap gap-2">
            <a
              v-for="social in socialLinks"
              :key="social.label"
              :href="social.href"
              :aria-label="social.label"
              class="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/70 transition-colors hover:border-lime hover:bg-lime hover:text-slate"
              target="_blank"
              rel="noopener noreferrer"
            >
              <AppIcon :icon="social.icon" class="h-4 w-4" />
            </a>
          </div>
        </div>

        <div
          v-for="section in footerSections"
          :key="section.title"
          class="min-w-0 text-right lg:col-span-2"
          :class="section.wide ? 'sm:col-span-2 lg:col-span-3' : ''"
        >
          <h2 class="mb-3 text-sm font-bold text-white">{{ section.title }}</h2>
          <ul class="space-y-1">
            <li v-for="link in section.links" :key="link.label">
              <NuxtLink :to="link.to" class="inline-flex min-h-10 items-center text-sm text-white/65 transition-colors hover:text-lime">
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>

      <div class="mt-8 grid grid-cols-1 gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-4 sm:grid-cols-3 sm:px-5">
        <p
          v-for="badge in trustBadges"
          :key="badge.label"
          class="flex min-h-10 items-center gap-2 text-xs font-bold leading-snug text-white/75"
        >
          <AppIcon :icon="badge.icon" class="h-4 w-4 shrink-0 text-lime" />
          {{ badge.label }}
        </p>
      </div>

      <div class="mt-8 flex flex-col items-center justify-between gap-2 border-t border-white/10 pt-5 text-center text-xs leading-relaxed text-white/45 sm:flex-row sm:text-right">
        <p>© {{ currentYear }} Booklett — فروشگاه آنلاین کتاب</p>
        <p>پرداخت امن با زرین‌پال (حالت آزمایشی)</p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const footerSections = [
  {
    title: 'فروشگاه',
    links: [
      { label: 'تازه‌ها', to: '/new' },
      { label: 'پرفروش‌ها', to: '/bestseller' },
      { label: 'پیشنهاد روز', to: '/daily-offers' },
      { label: 'علاقه‌مندی‌ها', to: '/wishlist' },
    ],
  },
  {
    title: 'حساب کاربری',
    links: [
      { label: 'پنل کاربری', to: '/account' },
      { label: 'ورود / ثبت‌نام', to: '/login' },
      { label: 'دمو داشبورد', to: '/login#demo' },
      { label: 'سبد خرید', to: '/cart' },
    ],
  },
  {
    title: 'راهنما و پشتیبانی',
    wide: true,
    links: [
      { label: 'درباره ما', to: '/about' },
      { label: 'راهنمای خرید', to: '/about#guide' },
      { label: 'سوالات متداول', to: '/about#faq' },
      { label: 'بازگشت کالا', to: '/about#returns' },
      { label: 'ایمیل پشتیبانی', to: '/about' },
    ],
  },
]

const socialLinks = [
  { label: 'Instagram', icon: 'mdi:instagram', href: 'https://instagram.com' },
  { label: 'LinkedIn', icon: 'mdi:linkedin', href: 'https://linkedin.com' },
  { label: 'Telegram', icon: 'mdi:telegram', href: 'https://telegram.org' },
]

const trustBadges = [
  { icon: 'mdi:truck-fast-outline', label: 'ارسال ۳ تا ۵ روز کاری' },
  { icon: 'mdi:shield-check-outline', label: 'پرداخت امن زرین‌پال' },
  { icon: 'mdi:backup-restore', label: 'بازگشت کالا تا ۷ روز' },
]

const currentYear = new Date().getFullYear()
</script>

<style scoped>
.footer-root {
  direction: rtl;
}
</style>
