// stores/counter.ts
import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

export const useCounterStore = defineStore('counter', () => {
  const count = ref<number>(0)

  const doubleCount = computed(() => count.value * 2)

  function increment(): void {
    count.value++
  }

  // بارگذاری مقدار از localStorage فقط در کلاینت
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('counter')
    if (saved) {
      count.value = parseInt(saved)
    }

    watch(count, (newVal) => {
      localStorage.setItem('counter', newVal.toString())
    })
  }

  return { count, doubleCount, increment }
})
