import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUIStore = defineStore('ui', () => {
  const isMobileMenuOpen = ref<boolean>(false)

  function toggleMobileMenu(): void {
    isMobileMenuOpen.value = !isMobileMenuOpen.value
  }

  function closeMobileMenu(): void {
    isMobileMenuOpen.value = false
  }

  return {
    isMobileMenuOpen,
    toggleMobileMenu,
    closeMobileMenu,
  }
})
