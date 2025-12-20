import { ref } from 'vue'

type ToastType = 'success' | 'error' | 'warning' | 'info'

interface Toast {
  id: number
  type: ToastType
  title: string
  message: string
}

const toasts = ref<Toast[]>([])
let counter = 1

export function useMyToast() {
  const add = (toast: {
    type?: ToastType
    title?: string
    message: string
    duration?: number
  }) => {
    const id = counter++

    toasts.value.push({
      id,
      type: toast.type || 'info',
      title: toast.title || 'پیام سیستم',
      message: toast.message
    })

    setTimeout(() => remove(id), toast.duration || 3500)
  }

  const remove = (id: number) => {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }

  return { toasts, add, remove }
}
