// stores/cart.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface CartItem {
  id: string | number
  name: string
  price: number
  quantity: number
  uniqueId: string
  image?: string
}

const STORAGE_KEY = 'cart'

function generateUniqueId() {
  try {
    // @ts-ignore runtime crypto
    if (typeof crypto !== 'undefined' && typeof (crypto as any).randomUUID === 'function') {
      // some envs may not have crypto.randomUUID
      // ts-ignore because lib.dom may or may not include it depending on tsconfig
      return (crypto as any).randomUUID()
    }
  } catch {
    // fallback below
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

function isValidCartArray(value: unknown): value is CartItem[] {
  if (!Array.isArray(value)) return false
  return value.every((it) => {
    if (!it || typeof it !== 'object') return false
    const o = it as Partial<CartItem>
    return (
      (typeof o.id === 'string' || typeof o.id === 'number') &&
      typeof o.name === 'string' &&
      typeof o.price === 'number' &&
      typeof o.quantity === 'number' &&
      typeof o.uniqueId === 'string'
    )
  })
}

export const useCartStore = defineStore('cart', () => {
  const cartItems = ref<CartItem[]>([])

  // getters
  const cartCount = computed(() => cartItems.value.reduce((t, i) => t + i.quantity, 0))
  const cartTotal = computed(() => cartItems.value.reduce((t, i) => t + i.price * i.quantity, 0))

  // actions
  function addToCart(product: { id: string | number; name: string; price: number; image?: string }, quantity = 1) {
    const existing = cartItems.value.find((i) => i.id === product.id)
    if (existing) {
      existing.quantity += quantity
    } else {
      const uniqueId = generateUniqueId()
      cartItems.value.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image ?? '',
        quantity,
        uniqueId,
      })
    }
    saveCart()
  }

  function removeFromCart(uniqueId: string) {
    cartItems.value = cartItems.value.filter((item) => item.uniqueId !== uniqueId)
    saveCart()
  }

  function updateQuantity(uniqueId: string, quantity: number) {
    if (quantity <= 0) {
      removeFromCart(uniqueId)
      return
    }
    const item = cartItems.value.find((i) => i.uniqueId === uniqueId)
    if (item) {
      item.quantity = quantity
      saveCart()
    }
  }

  function clearCart() {
    cartItems.value = []
    saveCart()
  }

  function saveCart() {
    // client-only
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems.value))
    } catch (e) {
      // ممکنه quota پر شده باشه یا مرورگر حالت حریم خصوصی داشته باشد
      // لاگ یا روش fallbacks در صورت نیاز
      // در پروژه واقعی شاید بخواهی به سرویس لاگینگ گزارش بدی
      // console.error('Failed to save cart', e)
    }
  }

  function loadCart() {
    if (typeof window === 'undefined') return
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return
      const parsed = JSON.parse(raw)
      if (isValidCartArray(parsed)) {
        // defensive copy
        cartItems.value = parsed.map((it) => ({ ...it }))
      } else {
        // invalid data — پاک می‌کنیم یا fallback
        cartItems.value = []
        localStorage.removeItem(STORAGE_KEY)
      }
    } catch (e) {
      // parse error — پاک کن و لاگ کن
      cartItems.value = []
      try {
        localStorage.removeItem(STORAGE_KEY)
      } catch {}
    }
  }

  // Optional: sync across tabs
  if (typeof window !== 'undefined') {
    window.addEventListener('storage', (e) => {
      if (e.key === STORAGE_KEY) {
        // reload the cart when another tab updates it
        loadCart()
      }
    })
  }

  return {
    cartItems,
    cartCount,
    cartTotal,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    saveCart,
    loadCart,
  }
})
