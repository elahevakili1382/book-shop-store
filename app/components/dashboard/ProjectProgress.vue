<template>
  <div class="w-full sm:w-[320px] md:w-[360px] bg-white rounded-2xl shadow p-6 flex flex-col items-center transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl">


     <div class="w-full flex justify-start mb-2">
    <h3 class="text-lg font-semibold text-gray-800">پیشرفت فروش</h3>
  </div>
    
    <div class="w-40 h-20 relative">

      <svg class="w-full h-full" viewBox="0 0 100 50" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img">
        <path
          d="M 0 50 A 50 50 0 0 1 100 50"
          fill="none"
          stroke="#e5e7eb"
          stroke-width="20"
          stroke-linecap="round"
        />
        <path
          :d="arcPath(percentClamped)"
          fill="none"
          stroke="#250F95"
          stroke-width="20"
          stroke-linecap="round"
          :style="arcStyle"
        />
      </svg>

      <div class="absolute inset-0 flex items-end justify-center pointer-events-none">
        <div class="mb-0 text-center">
          <div class="text-2xl font-bold text-gray-800 transition-all duration-500 ease-out">{{ percentClamped }}%</div>
        </div>
      </div>
    </div>

    <div class="mt-12 text-center w-full">
      <div class="text-sm text-gray-500">واحدهای فروخته‌شده</div>
      <div class="text-base font-semibold text-black">{{ totalUnitsSold }}</div>

      <div class="mt-5 text-xs text-gray-500">هدف:</div>
      <div class="text-sm font-semibold text-black">{{ targetUnits }}</div>
    </div>

    <div v-if="loading" class="mt-3 text-sm text-gray-500">در حال بارگیری...</div>
    <div v-if="error" class="mt-3 text-sm text-red-500">{{ error }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'


const props = defineProps({
  expectedPerProduct: {
    type: Number,
    default: 50,
  },
  sourceUrl: {
    type: String,
    default: 'https://fakestoreapi.com/products',
  },
})

type FSProduct = {
  id: number
  title: string
  price: number
  description?: string
  category?: string
  image?: string
  rating?: {
    rate?: number
    count?: number
  }
}

const loading = ref(true)
const error = ref<string | null>(null)
const products = ref<FSProduct[]>([])

onMounted(async () => {
  loading.value = true
  error.value = null
  try {
    products.value = await $fetch<FSProduct[]>(props.sourceUrl)
  } catch (err: any) {
    console.error('Failed to fetch products:', err)
    error.value = 'خطا در دریافت اطلاعات محصولات'
  } finally {
    loading.value = false
  }
})

const totalUnitsSold = computed(() => {
  return products.value.reduce((acc, p) => acc + (p.rating?.count ?? 0), 0)
})

const targetUnits = computed(() => {
  return Math.max(1, Math.round((products.value.length || 0) * props.expectedPerProduct))
})

const percent = computed(() => {
  return 41; // ثابت 41 درصد
})

const percentClamped = computed(() => Math.min(100, Math.max(0, percent.value)))


const arcPath = (pct: number) => {
  const angle = (pct / 100) * 180
  const radians = (angle * Math.PI) / 180
  const x = 50 + 50 * Math.cos(Math.PI - radians)
  const y = 50 - 50 * Math.sin(Math.PI - radians)
  if (pct <= 0) return 'M 0 50'
  return `M 0 50 A 50 50 0 0 1 ${x} ${y}`
}


const SEMICIRC_LEN = Math.PI * 50
const arcStyle = computed(() => {
  const offset = SEMICIRC_LEN * (1 - percentClamped.value / 100)
  return {
    transition: 'stroke-dashoffset 800ms ease',
    strokeDasharray: `${SEMICIRC_LEN}px`,
    strokeDashoffset: `${offset}px`,
  }
})

</script>

<style scoped>

svg {
  transform: rotate(.180deg);
  overflow: visible;
}
</style>
