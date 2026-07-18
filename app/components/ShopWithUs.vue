<template>
  <section class="shop-with-us rounded-[2rem] overflow-hidden relative">
    <div class="absolute inset-0 bg-gradient-to-br from-slate via-[#3a464c] to-slate pointer-events-none" />
    <div class="absolute top-0 left-0 w-72 h-72 rounded-full bg-lime/10 blur-3xl pointer-events-none" />
    <div class="absolute bottom-0 right-0 w-64 h-64 rounded-full bg-white/5 blur-3xl pointer-events-none" />

    <div class="relative z-10 grid lg:grid-cols-2 gap-10 p-8 sm:p-10 lg:p-12 items-start pb-12 lg:pb-16">
      <!-- متن -->
      <ClientOnly>
        <motion.div
          :initial="{ opacity: 0, y: 20 }"
          :while-in-view="{ opacity: 1, y: 0 }"
          :viewport="{ once: true, amount: 0.3 }"
          :transition="{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }"
          class="space-y-5 text-center lg:text-right order-2 lg:order-1"
        >
          <p class="text-xs font-bold tracking-[0.2em] text-lime/80">WHY US</p>
          <h2 class="text-2xl sm:text-3xl font-black leading-tight text-white">
            چرا از ما خرید کنی؟
          </h2>
          <p class="text-sm sm:text-base text-white/65 leading-relaxed max-w-md mx-auto lg:mx-0">
            مجموعه‌ای منتخب از بهترین کتاب‌ها، قیمت شفاف، پشتیبانی سریع و تجربه خرید ساده — همه در یک فروشگاه.
          </p>
          <ul class="space-y-2.5 text-sm text-white/80 text-right max-w-sm mx-auto lg:mx-0">
            <li
              v-for="(item, i) in perks"
              :key="item"
              class="flex items-center gap-2.5 justify-center lg:justify-start"
            >
              <span class="flex items-center justify-center w-6 h-6 rounded-full bg-lime/15 shrink-0">
                <AppIcon icon="mdi:check" class="w-3.5 h-3.5 text-lime" />
              </span>
              {{ item }}
            </li>
          </ul>
          <motion.div :while-hover="{ scale: 1.03 }" :while-tap="{ scale: 0.98 }" class="inline-block">
            <NuxtLink
              to="/about"
              class="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-lime text-slate font-bold text-sm hover:opacity-95 transition-opacity"
            >
              بیشتر بدانید
              <AppIcon icon="mdi:arrow-left" class="w-4 h-4" />
            </NuxtLink>
          </motion.div>
        </motion.div>
        <template #fallback>
          <div class="space-y-5 text-center lg:text-right order-2 lg:order-1">
            <p class="text-xs font-bold tracking-[0.2em] text-lime/80">WHY US</p>
            <h2 class="text-2xl sm:text-3xl font-black leading-tight text-white">چرا از ما خرید کنی؟</h2>
          </div>
        </template>
      </ClientOnly>

      <!-- کollage کتاب — گرید بدون حاشیه سفید -->
      <ClientOnly>
        <motion.div
          :initial="{ opacity: 0, scale: 0.96 }"
          :while-in-view="{ opacity: 1, scale: 1 }"
          :viewport="{ once: true, amount: 0.25 }"
          :transition="{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }"
          class="order-1 lg:order-2"
        >
          <div class="grid grid-cols-3 gap-2.5 sm:gap-3 max-w-[340px] mx-auto lg:max-w-none lg:mr-0">
            <motion.div
              v-for="(book, index) in displayBooks"
              :key="book.id"
              :initial="{ opacity: 0, y: 16 }"
              :while-in-view="{ opacity: 1, y: 0 }"
              :viewport="{ once: true }"
              :transition="{ duration: 0.45, delay: index * 0.07 }"
              :while-hover="{ y: -6, scale: 1.03 }"
              :class="[
                'relative overflow-hidden rounded-2xl shadow-[0_12px_32px_rgba(0,0,0,0.35)]',
                gridSpan(index),
              ]"
            >
              <NuxtImg
                :src="book.image"
                :alt="book.title"
                width="200"
                height="260"
                class="w-full h-full object-cover"
                format="webp"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-slate/50 via-transparent to-transparent pointer-events-none" />
            </motion.div>
          </div>
        </motion.div>
        <template #fallback>
          <div class="order-1 lg:order-2 grid grid-cols-3 gap-2 max-w-[280px] mx-auto">
            <div v-for="n in 6" :key="n" class="aspect-[3/4] rounded-2xl bg-white/10 animate-pulse" />
          </div>
        </template>
      </ClientOnly>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { motion } from 'motion-v'

type DisplayBook = {
  id: string
  title: string
  image: string
}

const displayBooks = ref<DisplayBook[]>([])

/** چیدمان bento: بعضی سلول‌ها بلندتر */
const spanClasses = [
  'col-span-1 row-span-2 aspect-auto min-h-[110px] sm:min-h-[140px]',
  'col-span-1 row-span-1 aspect-[3/4]',
  'col-span-1 row-span-1 aspect-[3/4]',
  'col-span-1 row-span-1 aspect-[3/4]',
  'col-span-1 row-span-2 aspect-auto min-h-[110px] sm:min-h-[140px]',
  'col-span-1 row-span-1 aspect-[3/4]',
]

function gridSpan(index: number) {
  return spanClasses[index] ?? 'col-span-1 aspect-[3/4]'
}

onMounted(async () => {
  try {
    const data = await $fetch<Array<{ id: string; title: string; image: string }>>('/api/books')
    displayBooks.value = (data ?? []).slice(0, 6).map((b) => ({
      id: b.id,
      title: b.title,
      image: b.image,
    }))
  } catch {
    displayBooks.value = [
      { id: '1', title: 'Atomic Habits', image: '/images/books/atomic-habits.jpg' },
      { id: '2', title: 'Clean Code', image: '/images/books/clean-code.jpg' },
      { id: '3', title: 'Deep Work', image: '/images/books/deep-work.jpg' },
      { id: '4', title: 'Sapiens', image: '/images/books/sapiens.jpg' },
      { id: '5', title: 'The Pragmatic Programmer', image: '/images/books/atomic-habits.jpg' },
      { id: '6', title: 'Design Patterns', image: '/images/books/clean-code.jpg' },
    ]
  }
})

const perks = [
  'ارسال سریع به سراسر کشور',
  'کتاب‌های اصل با گارانتی',
  'پرداخت امن و آسان',
]
</script>

<style scoped>
.shop-with-us {
  direction: rtl;
}
</style>
