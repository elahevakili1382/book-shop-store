export type CheckoutDraft = {
  orderId?: string
  amount?: number
  payment: 'online' | 'delivery'
  fullName: string
  phone: string
  city: string
  postalCode: string
  address: string
  shippingMethod: 'courier' | 'pickup'
  selectedDay: string
  selectedSlot: string
}

export const SHIPPING_COST = {
  courier: 45_000,
  pickup: 0,
} as const

export function shippingFee(method: CheckoutDraft['shippingMethod'] | string | undefined) {
  return method === 'pickup' ? SHIPPING_COST.pickup : SHIPPING_COST.courier
}

export function shippingLabel(method: CheckoutDraft['shippingMethod'] | string | undefined) {
  return method === 'pickup' ? 'تحویل حضوری از فروشگاه' : 'ارسال پیک به آدرس'
}

const KEY = 'checkout'

export function loadCheckout(): Partial<CheckoutDraft> {
  if (!import.meta.client) return {}
  try {
    const raw = sessionStorage.getItem(KEY)
    if (!raw) return {}
    const data = JSON.parse(raw)
    return data && typeof data === 'object' ? data : {}
  } catch {
    return {}
  }
}

export function saveCheckout(patch: Partial<CheckoutDraft>, options?: { dropOrder?: boolean }) {
  if (!import.meta.client) return
  const next: Partial<CheckoutDraft> = { ...loadCheckout(), ...patch }
  if (options?.dropOrder) {
    delete next.orderId
    delete next.amount
  }
  sessionStorage.setItem(KEY, JSON.stringify(next))
}

export function clearCheckout() {
  if (!import.meta.client) return
  sessionStorage.removeItem(KEY)
}
