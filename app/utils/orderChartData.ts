import type { Order } from '../../types/dashboard'

export type ChartRange = 'هفتگی' | 'ماهانه' | 'سالانه'

export type ChartBucket = {
  labels: string[]
  data: number[]
  growthPercent: number
}

function orderDate(order: Order): Date | null {
  if (!order.createdAt) return null
  const d = new Date(order.createdAt)
  return Number.isNaN(d.getTime()) ? null : d
}

/** فقط سفارش‌های موفق/فعال در فروش حساب می‌شوند */
function isCountable(order: Order) {
  return order.status !== 'failed'
}

function sumAmount(orders: Order[]) {
  return orders.reduce((s, o) => s + (o.amount || 0), 0)
}

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

function addDays(d: Date, n: number) {
  const x = new Date(d)
  x.setDate(x.getDate() + n)
  return x
}

function monthKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

function growth(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0
  return Math.round(((current - previous) / previous) * 100)
}

const faWeekday = ['یک', 'دو', 'سه', 'چ', 'پ', 'ج', 'ش']

export function buildOrderChart(orders: Order[], range: ChartRange): ChartBucket {
  const list = orders.filter(isCountable)

  if (range === 'هفتگی') {
    const today = startOfDay(new Date())
    const labels: string[] = []
    const data: number[] = []
    const buckets: Order[][] = []

    for (let i = 6; i >= 0; i--) {
      const day = addDays(today, -i)
      labels.push(faWeekday[day.getDay()] ?? '')
      buckets.push([])
    }

    for (const order of list) {
      const d = orderDate(order)
      if (!d) continue
      const od = startOfDay(d)
      const diff = Math.round((today.getTime() - od.getTime()) / 86400000)
      if (diff >= 0 && diff <= 6) {
        buckets[6 - diff]!.push(order)
      }
    }

    for (let i = 0; i < 7; i++) {
      data.push(sumAmount(buckets[i]!))
    }

    const current = sumAmount(buckets.slice(4, 7).flat())
    const previous = sumAmount(buckets.slice(0, 3).flat())

    return { labels, data, growthPercent: growth(current, previous) }
  }

  if (range === 'ماهانه') {
    const now = new Date()
    const labels: string[] = []
    const data: number[] = []
    const keys: string[] = []

    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      keys.push(monthKey(d))
      labels.push(
        d.toLocaleDateString('fa-IR', { month: 'short', year: '2-digit' }),
      )
    }

    const sums = new Map(keys.map((k) => [k, 0]))
    for (const order of list) {
      const d = orderDate(order)
      if (!d) continue
      const k = monthKey(d)
      if (sums.has(k)) sums.set(k, (sums.get(k) ?? 0) + (order.amount || 0))
    }

    for (const k of keys) data.push(sums.get(k) ?? 0)

    const current = data.slice(-3).reduce((a, b) => a + b, 0)
    const previous = data.slice(-6, -3).reduce((a, b) => a + b, 0)

    return { labels, data, growthPercent: growth(current, previous) }
  }

  // سالانه — ۴ سال اخیر
  const year = new Date().getFullYear()
  const labels = [`${year - 3}`, `${year - 2}`, `${year - 1}`, `${year}`]
  const data = [0, 0, 0, 0]

  for (const order of list) {
    const d = orderDate(order)
    if (!d) continue
    const y = d.getFullYear()
    const idx = y - (year - 3)
    if (idx >= 0 && idx <= 3) data[idx]! += order.amount || 0
  }

  const current = data[3] ?? 0
  const previous = data[2] ?? 0

  return { labels, data, growthPercent: growth(current, previous) }
}

export function formatChartY(val: number) {
  if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(1)}M`
  if (val >= 1000) return `${Math.round(val / 1000)}k`
  return String(Math.round(val))
}

export function formatChartTooltip(val: number) {
  return `${new Intl.NumberFormat('fa-IR').format(val)} تومان`
}
