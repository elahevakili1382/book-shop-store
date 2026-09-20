import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

const STORAGE_KEY = 'booklett-wishlist'

function readIds(): string[] {
  if (!import.meta.client) return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed.map(String) : []
  } catch {
    return []
  }
}

export const useWishlistStore = defineStore('wishlist', () => {
  const ids = ref<string[]>([])

  const count = computed(() => ids.value.length)

  function load() {
    ids.value = readIds()
  }

  function persist() {
    if (!import.meta.client) return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids.value))
  }

  function has(id?: string | number | null) {
    if (id == null) return false
    return ids.value.includes(String(id))
  }

  function toggle(id?: string | number | null) {
    if (id == null) return false
    const key = String(id)
    const exists = ids.value.includes(key)
    ids.value = exists ? ids.value.filter((x) => x !== key) : [...ids.value, key]
    persist()
    return !exists
  }

  return { ids, count, load, has, toggle }
})
