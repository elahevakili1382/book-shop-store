// stores/categories.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Category {
  id:string 
  slug:string
  name: string
  icon: string
  items: number
}

function isValidCategoryArray(value: unknown): value is Category[] {
  if (!Array.isArray(value)) return false

  return value.every((c) => {
    return (
      c &&
      typeof c === 'object' &&
      typeof (c as any).id === 'string' &&
      typeof (c as any).slug === 'string' &&
      typeof (c as any).name === 'string' &&
      typeof (c as any).icon === 'string' &&
      typeof (c as any).items === 'number'
    )
  })
}


export const useCategoryStore = defineStore('category', () => {
  const categories = ref<Category[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const loadOnce = ref(false)

  const totalCategories = computed(() => categories.value.length) //برای نمایش تعداد دسته‌بندی‌ها بدون نیاز به محاسبه دستی.

const fetchCategories = async (force = false) => {

  if(loadOnce.value &&  !force) return //cache جلوگیری از لود اضافه 

  isLoading.value = true
  error.value = null
  try {
    const res = await $fetch<Category[]>('/data/categories.json')


    if (!isValidCategoryArray(res)) throw new Error('خطا در دریافت دسته‌بندی‌ها')
    categories.value =  res
  loadOnce.value = true
  } catch (err: any) {
    error.value = err.message || 'مشکل ناشناخته'
  } finally {
    isLoading.value = false
  }
}


  return { categories, isLoading, error,totalCategories, fetchCategories }
})
