import { ref } from 'vue'

export const user = ref(null) // یا یک ساختار اولیه کاربر

export function useUserSession() {
  return {
    user
  }
}
