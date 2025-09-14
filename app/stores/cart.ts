import { defineStore } from 'pinia'
import { onMounted } from 'vue'

interface CartItem {
  id: string | number
  name: string
  price: number
  quantity: number
  uniqueId: number
}

export const useCartStore = defineStore('cart', {
  state: () => ({
    cartItems: [] as CartItem[],
  }),
  getters: {
    cartCount: (state) => state.cartItems.reduce((total, item) => total + item.quantity, 0),
    cartTotal: (state) =>
      state.cartItems.reduce((total, item) => total + item.price * item.quantity, 0),
  },
  actions: {
    addToCart(product: Omit<CartItem, 'quantity' | 'uniqueId'>) {
      const existingItem = this.cartItems.find((item) => item.id === product.id)
      if (existingItem) {
        existingItem.quantity += 1
      } else {
        const uniqueProduct = { ...product, quantity: 1, uniqueId: Date.now() + Math.random() }
        this.cartItems.push(uniqueProduct)
      }
      this.saveCart()
    },
    removeFromCart(uniqueId: number) {
      this.cartItems = this.cartItems.filter((item) => item.uniqueId !== uniqueId)
      this.saveCart()
    },
    updateQuantity(productId: number, quantity: number) {
      const item = this.cartItems.find((item) => item.id === productId)
      if (item) item.quantity = quantity
      this.saveCart()
    },
    clearCart() {
      this.cartItems = []
      this.saveCart()
    },
    saveCart() {
      if (process.client) {
        localStorage.setItem('cart', JSON.stringify(this.cartItems))
      }
    },
    loadCart() {
      if (process.client) {
        const stored = localStorage.getItem('cart')
        if (stored) this.cartItems = JSON.parse(stored)
      }
    },
  },
})
