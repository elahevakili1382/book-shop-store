<template>
  <div class="w-full rounded-2xl border border-[#2A2D36] p-5 space-y-4 shadow-lg shadow-black/30"
    style="background:#1C1E24">
    <div class="flex items-center justify-between gap-3">
      <h3 class="text-lg font-bold text-[#F5F2EB]">نظرات اخیر</h3>
      <span class="text-[10px] font-bold tracking-wide px-2.5 py-1 rounded-full"
        style="background:#FB71851A; color:#FB7185">
        {{ totalCount || 0 }} نظر
      </span>
    </div>

    <p v-if="loading" class="text-sm text-[#A8A29E] py-8 text-center">در حال بارگذاری...</p>
    <p v-else-if="error" class="text-sm text-rose-300 py-4">
      {{ error }}
      <button type="button" class="mr-2 underline" @click="fetchReviews">تلاش مجدد</button>
    </p>
    <p v-else-if="reviews.length === 0"
      class="text-sm text-[#A8A29E] py-8 text-center border border-dashed border-[#2A2D36] rounded-xl">
      هنوز نظری ثبت نشده است
    </p>

    <div v-else class="space-y-3">
      <div v-for="review in reviews" :key="review.id"
        class="rounded-xl p-4 border border-[#2A2D36]/70 transition hover:border-[#2A2D36]"
        style="background:#14151A">
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0 flex-1">
            <!-- book title -->
            <p class="text-sm font-semibold text-[#F5F2EB] truncate">{{ review.bookTitle }}</p>
            <!-- stars -->
            <div class="flex items-center gap-0.5 mt-1.5">
              <span v-for="i in 5" :key="i"
                class="text-base leading-none"
                :class="i <= review.rating ? 'text-amber-400' : 'text-[#2A2D36]'">
                ★
              </span>
              <span class="text-xs text-[#A8A29E] mr-2">{{ review.authorName }}</span>
            </div>
            <!-- comment -->
            <p class="text-xs text-[#A8A29E] mt-2 leading-relaxed">
              {{ truncateComment(review.comment) }}
            </p>
          </div>
          <!-- date -->
          <span class="text-[10px] text-[#A8A29E]/60 shrink-0 mt-0.5">{{ formatDate(review.createdAt) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { ReviewItem, ReviewsResponse } from '~/types/dashboard'
import { formatDate } from '../../utils/formatDate'

const reviews = ref<ReviewItem[]>([])
const totalCount = ref(0)
const loading = ref(true)
const error = ref<string | null>(null)

function truncateComment(text: string) {
  if (!text) return ''
  return text.length > 120 ? text.slice(0, 120) + '...' : text
}

async function fetchReviews() {
  loading.value = true
  error.value = null
  try {
    const res = await $fetch<ReviewsResponse>('/api/dashboard/reviews')
    reviews.value = res.reviews
    totalCount.value = res.totalCount
  } catch {
    error.value = 'خطا در دریافت نظرات'
  } finally {
    loading.value = false
  }
}

onMounted(fetchReviews)
</script>