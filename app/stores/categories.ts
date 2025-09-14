// stores/categories.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface Category {
  id: number
  name: string
  icon: string
  items: number
}

export const useCategoryStore = defineStore('category', () => {
  const categories = ref<Category[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

const fetchCategories = async () => {
  isLoading.value = true
  error.value = null
  try {
    const res = await fetch('/data/categories.json')
    if (!res.ok) throw new Error('خطا در دریافت دسته‌بندی‌ها')
    categories.value = await res.json()
  } catch (err: any) {
    error.value = err.message || 'مشکل ناشناخته'
  } finally {
    isLoading.value = false
  }
}


  return { categories, isLoading, error, fetchCategories }
})
