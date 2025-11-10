<template>
  <div class="w-full sm:w-[320px] md:w-[380px] bg-white rounded-2xl shadow p-6 flex flex-col transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl">
    <!-- هدر کارت -->
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-semibold text-gray-800">Time Tracker</h3>
      <button class="flex items-center gap-2 border border-blue-600 text-blue-800 px-3 py-1 rounded-full hover:bg-blue-800 hover:text-white transition text-sm">
        <FontAwesome :icon="['fas','plus']" class="w-3 h-3" /> افزودن
      </button>
    </div>

    <!-- تایمر -->
    <div class="flex flex-col items-center justify-center mt-2">
      <div class="text-4xl font-bold text-gray-800">{{ formattedTime }}</div>
      <div class="text-sm text-gray-500 mt-1">{{ currentTask || 'هیچ کاری در حال اجرا نیست' }}</div>
    </div>

    <!-- نوار پیشرفت روزانه -->
    <div class="mt-12 w-full">
      <div class="flex justify-between mb-1 text-xs text-gray-500">
        <span>پیشرفت امروز</span>
        <span>{{ percentCompleted }}%</span>
      </div>
      <div class="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
        <div
          class="h-full bg-blue-600 rounded-full transition-all duration-500"
          :style="{ width: percentCompleted + '%' }"
        ></div>
      </div>
    </div>

    <!-- کنترل تایمر -->
    <div class="mt-4 flex justify-center gap-3">
      <button
        class="px-3 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-700 text-sm transition-all duration-500 ease-out hover:scale-110"
        @click="startTimer"
      >
        شروع
      </button>
      <button
        class="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm transition-all duration-500 ease-out hover:scale-110"
        @click="pauseTimer"
      >
        توقف
      </button>
      <button
        class="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-gray-600 text-sm transition-all duration-500 ease-out hover:scale-110"
        @click="resetTimer"
      >
        ریست
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

const totalTargetMinutes = 480 // کل زمان کاری روزانه به دقیقه (8 ساعت)
const elapsedMinutes = ref(0)
const timer = ref<ReturnType<typeof setInterval> | null>(null)
const currentTask = ref<string>('طراحی داشبورد')

// درصد پیشرفت روزانه
const percentCompleted = computed(() => Math.min(100, Math.round((elapsedMinutes.value / totalTargetMinutes) * 100)))

// نمایش زمان به فرمت hh:mm:ss
const formattedTime = computed(() => {
  const h = Math.floor(elapsedMinutes.value / 60)
  const m = elapsedMinutes.value % 60
  const s = seconds.value
  return `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`
})

const seconds = ref(0)

// تایمر اصلی
const startTimer = () => {
  if (timer.value) return
  timer.value = setInterval(() => {
    seconds.value++
    if (seconds.value >= 60) {
      elapsedMinutes.value++
      seconds.value = 0
    }
  }, 1000)
}

const pauseTimer = () => {
  if (timer.value) clearInterval(timer.value)
  timer.value = null
}

const resetTimer = () => {
  pauseTimer()
  elapsedMinutes.value = 0
  seconds.value = 0
}

onBeforeUnmount(() => {
  if (timer.value) clearInterval(timer.value)
})
</script>

<style scoped>
/* می‌تونی سایه و rounded کارت‌ها رو اینجا هم شخصی سازی کنی */
</style>
