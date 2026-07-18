import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useUIStore = defineStore('ui', () => {
  const isMobileMenuOpen = ref<boolean>(false)

  function toggleMobileMenu(): void {
    isMobileMenuOpen.value = !isMobileMenuOpen.value
  }

  function closeMobileMenu(): void {
    isMobileMenuOpen.value = false
  }

  watch(isMobileMenuOpen, (open) => {
    if (import.meta.client) {
      document.body.style.overflow = open ? 'hidden' : ''
    }
  })

  return {
    isMobileMenuOpen,
    toggleMobileMenu,
    closeMobileMenu,
  }
})
