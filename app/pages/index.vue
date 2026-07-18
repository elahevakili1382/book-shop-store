<template>
  <main class="home-page bg-cream min-h-screen overflow-x-hidden">
    <HeroSection />

    <div class="home-sections max-w-[1280px] mx-auto px-4 sm:px-8 pb-16 space-y-16 lg:space-y-20">
       <SectionReveal>
        <Features />
      </SectionReveal>
      <SectionReveal :delay="0.05">
        <NewArrival />
      </SectionReveal>
      <SectionReveal :delay="0.08" direction="left">
        <BestSelling />
      </SectionReveal>
      <SectionReveal>
        <DealsOfDay />
      </SectionReveal>
      <SectionReveal direction="right">
        <ShopWithUs />
      </SectionReveal>
      <SectionReveal>
        <JoinWithUs />
      </SectionReveal>
    </div>
  </main>
</template>

<script setup lang="ts">
import HeroSection from '../components/HeroSection.vue'
import Features from '../components/Features.vue'
import NewArrival from '../components/NewArrival.vue'
import BestSelling from '../components/BestSelling.vue'
import DealsOfDay from '../components/DealsOfDay.vue'
import ShopWithUs from '../components/ShopWithUs.vue'
import JoinWithUs from '../components/JoinWithUs.vue'
import SectionReveal from '../components/ui/SectionReveal.vue'

definePageMeta({
  layout: 'default',
})

useSeoMeta({
  title: 'فروشگاه کتاب | Booklet',
  description: 'خرید آنلاین کتاب — از رمان تا برنامه‌نویسی با قیمت شفاف و تحویل سریع.',
})
</script>

<style scoped>
.home-page {
  direction: rtl;
}
</style>
