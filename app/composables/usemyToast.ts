type ToastType = 'success' | 'error' | 'warning' | 'info'

interface Toast {
  id: number
  type: ToastType
  title: string
  message: string
}

export function useMyToast() {
  const toasts = useState<Toast[]>('app-toasts', () => [])

  const remove = (id: number) => {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }

  const add = (toast: {
    type?: ToastType
    title?: string
    message: string
    duration?: number
  }) => {
    const id = Date.now() + Math.floor(Math.random() * 1000)

    toasts.value = [
      ...toasts.value,
      {
        id,
        type: toast.type || 'info',
        title: toast.title || 'پیام سیستم',
        message: toast.message
      }
    ]

    setTimeout(() => remove(id), toast.duration || 3500)
  }

  return { toasts, add, remove }
}
