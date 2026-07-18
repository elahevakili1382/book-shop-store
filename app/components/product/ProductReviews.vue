<template>
  <section id="reviews" class="mt-12 lg:mt-16">
    <div class="rounded-2xl bg-white border border-slate/8 overflow-hidden">
      <div class="px-5 sm:px-6 lg:px-8 py-5 border-b border-slate/8 bg-cream/50 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 class="text-base font-bold text-slate">نظرات خریداران</h2>
          <p v-if="total > 0" class="text-xs text-slate/45 mt-1">
            {{ total.toLocaleString('fa-IR') }} نظر ثبت‌شده
          </p>
        </div>

        <div v-if="averageRating > 0" class="flex items-center gap-2 rounded-xl bg-white border border-slate/8 px-4 py-2">
          <span class="text-lg font-black text-slate">{{ averageRating.toLocaleString('fa-IR') }}</span>
          <div class="inline-flex items-center gap-0.5">
            <AppIcon
              v-for="star in 5"
              :key="star"
              :icon="starIcon(star, averageRating)"
              :class="[
                'w-4 h-4',
                star <= Math.round(averageRating) ? 'text-lime' : 'text-slate/15',
              ]"
            />
          </div>
          <span class="text-xs text-slate/40">میانگین</span>
        </div>
      </div>

      <div v-if="pending" class="px-5 sm:px-6 lg:px-8 py-10 text-center text-sm text-slate/45 animate-pulse">
        در حال بارگذاری نظرات...
      </div>

      <div v-else-if="!reviews.length" class="px-5 sm:px-6 lg:px-8 py-12 text-center">
        <AppIcon icon="mdi:comment-text-outline" class="w-10 h-10 text-slate/20 mx-auto mb-3" />
        <p class="text-sm font-semibold text-slate/60">هنوز نظری ثبت نشده</p>
        <p class="text-xs text-slate/40 mt-1">اولین نفری باشید که تجربه‌تان را می‌نویسید</p>
      </div>

      <ul v-else class="divide-y divide-slate/8">
        <li
          v-for="review in reviews"
          :key="review.id"
          class="px-5 sm:px-6 lg:px-8 py-5 sm:py-6"
        >
          <div class="flex flex-wrap items-start justify-between gap-3 mb-3">
            <div class="flex items-center gap-3">
              <span
                class="w-10 h-10 rounded-full bg-lime/25 text-slate font-bold text-sm flex items-center justify-center shrink-0"
                aria-hidden="true"
              >
                {{ review.authorName.charAt(0) }}
              </span>
              <div>
                <p class="text-sm font-bold text-slate">{{ review.authorName }}</p>
                <p class="text-xs text-slate/40 mt-0.5">{{ formatDate(review.createdAt) }}</p>
              </div>
            </div>
            <div class="inline-flex items-center gap-0.5" :aria-label="`امتیاز ${review.rating} از ۵`">
              <AppIcon
                v-for="star in 5"
                :key="star"
                :icon="star <= review.rating ? 'mdi:star' : 'mdi:star-outline'"
                :class="['w-4 h-4', star <= review.rating ? 'text-lime' : 'text-slate/15']"
              />
            </div>
          </div>
          <p class="text-sm text-slate/70 leading-relaxed">{{ review.comment }}</p>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { ProductReview } from '~/types/types'

defineProps<{
  reviews: ProductReview[]
  total: number
  averageRating: number
  pending?: boolean
}>()

function starIcon(star: number, rating: number): string {
  if (star <= Math.floor(rating)) return 'mdi:star'
  if (star - rating <= 0.5) return 'mdi:star-half-full'
  return 'mdi:star-outline'
}

function formatDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(iso))
  } catch {
    return iso
  }
}
</script>
