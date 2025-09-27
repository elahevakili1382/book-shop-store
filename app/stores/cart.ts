import { defineStore } from 'pinia'

export interface CartItem {
  id: string | number
  name: string
  price: number
  quantity: number
  uniqueId: string
  image:string
}

export const useCartStore = defineStore('cart', {
  state: () => ({
    cartItems: [] as CartItem[],
  }),
  getters: {
    cartCount: (state) => state.cartItems.reduce((t, i) => t + i.quantity, 0),
    cartTotal: (state) => state.cartItems.reduce((t, i) => t + i.price * i.quantity, 0),
  },
  actions: {
  addToCart(product: { id: string | number; name: string; price: number; image: string }, quantity: number = 1) {
    const existing = this.cartItems.find(i => i.id === product.id)
    if (existing) {
      existing.quantity += quantity
    } else {
      const uniqueId = typeof crypto !== 'undefined' && (crypto as any).randomUUID
        ? (crypto as any).randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
      this.cartItems.push({ ...product, quantity, uniqueId })
    }
    this.saveCart()
  },

    removeFromCart(uniqueId: string) {
      this.cartItems = this.cartItems.filter(item => item.uniqueId !== uniqueId)
      this.saveCart()
    },

    updateQuantity(uniqueId: string , quantity: number) {
      if (quantity <= 0) {
        this.removeFromCart(uniqueId)
        return
      }
      const item = this.cartItems.find(i => i.uniqueId === uniqueId)
      if (item) {
        item.quantity = quantity
        this.saveCart()
      }
    },

    clearCart() {
      this.cartItems = []
      this.saveCart()
    },

    saveCart() {
      if (typeof window === 'undefined') return
      try {
        localStorage.setItem('cart', JSON.stringify(this.cartItems))
      } catch (e) {
        console.error('Failed to save cart', e)
      }
    },

    loadCart() {
      if (typeof window === 'undefined') return
      try {
        const raw = localStorage.getItem('cart')
        if (raw) this.cartItems = JSON.parse(raw)
      } catch (e) {
        console.error('Failed to load cart', e)
      }
    },
  },
})
