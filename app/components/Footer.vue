<template>
  <footer class="footer-root mt-16 border-t border-slate/10 bg-white">
    <div class="max-w-[1280px] mx-auto px-4 sm:px-8 py-12 lg:py-14">
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-8">

        <div
          v-for="(section, index) in footerSections"
          :key="section.title"
          class="text-right lg:col-auto lg:row-auto"
          :class="mobileSectionGridClass(index)"
        >
          <h2 class="flex items-center gap-2 text-sm font-bold tracking-wide text-slate mb-4">
            <AppIcon :icon="section.icon" class="w-4 h-4 text-slate/50" />
            {{ section.title }}
          </h2>
          <template v-if="section.type === 'contact'">
            <ul class="space-y-3 text-sm text-slate/60">
              <li class="flex items-start gap-2">
                <AppIcon icon="mdi:map-marker-outline" class="w-4 h-4 shrink-0 mt-0.5 text-slate/40" />
                <span>تهران، میدان انقلاب</span>
              </li>
              <li class="flex items-center gap-2">
                <AppIcon icon="mdi:email-outline" class="w-4 h-4 shrink-0 text-slate/40" />
                <a href="mailto:hello@booklett.ir" class="footer-link">hello@booklett.ir</a>
              </li>
            </ul>
            <div class="flex gap-2 mt-5">
              <a
                v-for="social in socialLinks"
                :key="social.label"
                :href="social.href"
                :aria-label="social.label"
                class="w-9 h-9 flex items-center justify-center rounded-full bg-cream border border-slate/10 text-slate/60 hover:text-slate hover:border-slate/20 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <AppIcon :icon="social.icon" class="w-4 h-4" />
              </a>
            </div>
          </template>
          <ul v-else class="space-y-2.5">
            <li v-for="link in section.links" :key="link.label">
              <NuxtLink :to="link.to" class="footer-link text-sm text-slate/60 hover:text-slate transition-colors">
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>

      <div class="mt-12 pt-6 border-t border-slate/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate/45">
        <p>© {{ currentYear }} Booklett — فروشگاه آنلاین کتاب</p>
        <p>{{ footerTagline }}</p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
type FooterLink = {
  label: string
  to: string
}

type FooterSection = {
  title: string
  icon: string
  type?: 'contact'
  links?: FooterLink[]
}

const footerSections: FooterSection[] = [
  {
    title: 'فروشگاه',
    icon: 'mdi:book-open-page-variant',
    links: [
      { label: 'تازه‌ها', to: '/new' },
      { label: 'پرفروش‌ها', to: '/bestseller' },
      { label: 'پیشنهاد روز', to: '/daily-offers' },
      { label: 'درباره ما', to: '/about' },
    ],
  },
  {
    title: 'حساب کاربری',
    icon: 'mdi:account-outline',
    links: [
      { label: 'ورود / ثبت‌نام', to: '/login' },
      { label: 'سبد خرید', to: '/cart' },
      { label: 'آدرس‌ها', to: '/address' },
    ],
  },
  {
    title: 'راهنما',
    icon: 'mdi:help-circle-outline',
    links: [
      { label: 'راهنمای خرید', to: '/about' },
      { label: 'سوالات متداول', to: '/about' },
      { label: 'بازگشت کالا', to: '/about' },
    ],
  },
  {
    title: 'تماس با ما',
    icon: 'mdi:email-outline',
    type: 'contact',
  },
]

const socialLinks = [
  { label: 'Instagram', icon: 'mdi:instagram', href: 'https://instagram.com' },
  { label: 'LinkedIn', icon: 'mdi:linkedin', href: 'https://linkedin.com' },
  { label: 'Telegram', icon: 'mdi:telegram', href: 'https://telegram.org' },
]

const currentYear = new Date().getFullYear()

const footerTagline = 'اعتماد شما، اعتبار ماست.'

/** موبایل: ۲×۲ — ردیف۱ فروشگاه|حساب، ردیف۲ راهنما|تماس؛ دسکتاپ: lg:grid-cols-4 */
function mobileSectionGridClass(index: number): string {
  const placement: Record<number, string> = {
    0: 'col-start-1 row-start-1', // فروشگاه
    1: 'col-start-2 row-start-1', // حساب کاربری
    2: 'col-start-1 row-start-2',
    3: 'col-start-2 row-start-2' 
  }
  return placement[index] ?? ''
}
</script>

<style scoped>
.footer-root {
  direction: rtl;
}

.footer-link:hover {
  color: rgb(67 80 88);
}
</style>
