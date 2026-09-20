<template>
  <section class="hero-root relative overflow-hidden text-slate">
    <div
      class="hero-banner pointer-events-none absolute inset-3 z-0 rounded-[1.75rem] border border-slate/15 sm:inset-4 sm:rounded-[2rem] lg:inset-5"
      aria-hidden="true"
    />

    <div class="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
      <div class="flex flex-col pt-10 pb-6 sm:pt-14 lg:relative lg:min-h-[34rem] lg:py-24">
        <div class="relative z-20 mx-auto w-full max-w-xl text-center lg:mx-0 lg:text-right">
          <NuxtLink
            to="/new"
            class="inline-flex w-fit items-center gap-2 rounded-full border border-slate/15 bg-white p-1 pl-3 shadow-card"
          >
            <span class="rounded-full bg-lime px-2.5 py-1 text-[11px] font-bold text-slate">جدید</span>
            <span class="text-sm font-medium text-slate/70">تازه‌های این هفته Booklett</span>
            <AppIcon icon="mdi:arrow-left" class="size-4 text-slate/40" />
          </NuxtLink>

          <h1 class="mt-8 text-balance text-3xl font-black leading-[1.2] sm:text-5xl lg:text-[3.25rem]">
            کتاب بعدی‌ات یک کلیک فاصله دارد
          </h1>
          <p class="mx-auto mt-5 max-w-md text-base leading-relaxed text-slate/55 sm:text-lg lg:mx-0">
            از رمان تا برنامه‌نویسی — کاور واقعی، قیمت شفاف، تحویل سریع به سراسر کشور.
          </p>

          <form class="mx-auto mt-8 max-w-md lg:mx-0 lg:mt-10" @submit.prevent="onSearch">
            <div
              class="grid grid-cols-[1fr_auto] items-center rounded-2xl border border-slate/15 bg-white p-1.5 shadow-card has-[input:focus]:ring-2 has-[input:focus]:ring-lime/50"
            >
              <input
                v-model="searchQuery"
                type="search"
                placeholder="نام کتاب را جستجو کن..."
                class="h-12 w-full bg-transparent px-4 text-right text-sm font-medium text-slate outline-none placeholder:text-slate/35"
              />
              <button
                type="submit"
                class="inline-flex h-11 items-center justify-center rounded-xl bg-slate px-4 text-sm font-bold text-white hover:bg-lime hover:text-slate"
                aria-label="جستجو"
              >
                شروع کن
              </button>
            </div>
          </form>

          <ul class="mx-auto mt-8 w-fit space-y-2 text-sm font-medium text-slate/70 lg:mx-0 lg:text-right">
            <li class="flex items-center justify-center gap-2 lg:justify-start">
              <span class="h-1.5 w-1.5 rounded-full bg-lime" />
              ارسال سریع به سراسر کشور
            </li>
            <li class="flex items-center justify-center gap-2 lg:justify-start">
              <span class="h-1.5 w-1.5 rounded-full bg-lime" />
              قیمت شفاف بدون هزینه پنهان
            </li>
            <li class="flex items-center justify-center gap-2 lg:justify-start">
              <span class="h-1.5 w-1.5 rounded-full bg-lime" />
              کتاب اصل با گارانتی
            </li>
          </ul>
        </div>

        <div
          v-if="covers.length"
          class="hero-marquee relative z-10 mt-8 w-full overflow-hidden lg:absolute lg:inset-0 lg:z-0 lg:mt-0 lg:flex lg:items-center"
        >
          <div class="hero-marquee-track flex w-max items-center">
            <div v-for="copy in 2" :key="copy" class="flex items-center gap-3 pe-3 sm:gap-4 sm:pe-4">
              <NuxtLink
                v-for="book in covers"
                :key="`${copy}-${book.id}`"
                :to="productPath(book)"
                class="hero-cover shrink-0 overflow-hidden rounded-xl border border-slate/10 shadow-card sm:rounded-2xl"
              >
                <img
                  :src="book.image"
                  :alt="book.title"
                  width="180"
                  height="240"
                  loading="eager"
                  decoding="async"
                  class="h-36 w-[6.75rem] object-cover sm:h-44 sm:w-[8.25rem] lg:h-56 lg:w-[10.5rem]"
                />
              </NuxtLink>
            </div>
          </div>

          <div
            class="pointer-events-none absolute inset-y-0 right-0 hidden w-[58%] lg:block"
            aria-hidden="true"
            style="background: linear-gradient(to left, #fafaf8 12%, rgba(250, 250, 248, 0.88) 42%, rgba(250, 250, 248, 0) 100%)"
          />
          <div
            class="pointer-events-none absolute inset-y-0 left-0 w-8 lg:w-24"
            aria-hidden="true"
            style="background: linear-gradient(to right, #fafaf8, rgba(250, 250, 248, 0))"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { productPath } from '../utils/slugify'
import type { Product } from '../../types/types'

type CoverBook = { id: string; title: string; titleEn?: string; image: string; slug?: string }

const router = useRouter()
const searchQuery = ref('')

function hasRealCover(image?: string) {
  if (!image) return false
  return !image.includes('NonFiction') && !image.includes('default-book')
}

const { data: coverSource } = await useAsyncData('hero-covers', async () => {
  try {
    const data = await $fetch<Product[]>('/api/books', { query: { limit: 24 } })
    const ranked = [...(data ?? [])].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
    const withCover = ranked.filter((b) => hasRealCover(b.image))
    return (withCover.length ? withCover : ranked).slice(0, 16).map((b) => ({
      id: String(b.id ?? b._id),
      title: b.title,
      titleEn: b.titleEn,
      image: b.image,
      slug: b.slug,
    }))
  } catch {
    return [] as CoverBook[]
  }
})

const covers = computed(() => coverSource.value ?? [])

function onSearch() {
  const q = searchQuery.value.trim()
  router.push(q ? { path: '/new', query: { q } } : '/new')
}
</script>

<style scoped>
.hero-root {
  direction: rtl;
}

.hero-marquee {
  direction: ltr;
}

.hero-marquee-track {
  animation: cover-marquee 18s linear infinite;
  animation-delay: 0s;
  will-change: transform;
}

.hero-cover {
  transition: transform 0.35s ease;
}

.hero-cover:hover {
  transform: translateY(-4px);
}

@keyframes cover-marquee {
  from {
    transform: translate3d(0, 0, 0);
  }
  to {
    transform: translate3d(-50%, 0, 0);
  }
}

@media (max-width: 1023px) {
  .hero-marquee {
    position: relative;
    inset: auto;
    margin-top: 2rem;
    z-index: 10;
  }
}

@media (min-width: 1024px) {
  .hero-marquee {
    pointer-events: none;
  }

  .hero-marquee-track {
    animation-duration: 32s;
  }

  .hero-marquee .hero-cover {
    pointer-events: auto;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero-marquee-track {
    animation: none;
  }
}
</style>
