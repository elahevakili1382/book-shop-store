import { createError } from 'h3'
import type { IOrderItem } from '../models/Order'
import { findBookByParam, type LeanBook } from './bookLookup'

export const SHIPPING_COST = {
  courier: 45_000,
  pickup: 0,
} as const

export type ShippingMethod = keyof typeof SHIPPING_COST

function asShippingMethod(value: unknown): ShippingMethod {
  return value === 'pickup' ? 'pickup' : 'courier'
}

function badRequest(message: string) {
  return createError({ statusCode: 400, statusMessage: message, message })
}

export async function buildOrderFromItems(rawItems: unknown, shippingMethod: unknown) {
  if (!Array.isArray(rawItems) || rawItems.length === 0) {
    throw badRequest('سبد خرید خالی است')
  }

  const shipping = asShippingMethod(shippingMethod)
  const qtyByKey = new Map<string, number>()

  for (const row of rawItems) {
    const rec = row && typeof row === 'object' ? (row as Record<string, unknown>) : {}
    const bookId = String(rec.bookId ?? rec.id ?? '').trim()
    const slug = String(rec.slug ?? '').trim()
    const key = bookId || slug
    const quantity = Number(rec.quantity)

    if (!key || !Number.isInteger(quantity) || quantity < 1) {
      throw badRequest('آیتم سفارش نامعتبر است. سبد را خالی کن و کتاب را دوباره اضافه کن')
    }

    qtyByKey.set(key, (qtyByKey.get(key) || 0) + quantity)
  }

  const qtyById = new Map<string, { book: LeanBook; quantity: number }>()

  for (const [key, quantity] of qtyByKey) {
    const book = await findBookByParam(key)
    if (!book) {
      throw badRequest(
        'یکی از کتاب‌های سبد در فروشگاه نیست. سبد را خالی کن و از صفحه کتاب دوباره اضافه کن',
      )
    }

    const id = book._id.toString()
    const prev = qtyById.get(id)
    if (prev) prev.quantity += quantity
    else qtyById.set(id, { book, quantity })
  }

  const items: IOrderItem[] = []
  let subtotal = 0

  for (const { book, quantity } of qtyById.values()) {
    const stock = book.stock ?? 0
    if (stock < quantity) {
      throw createError({
        statusCode: 409,
        statusMessage: `موجودی «${book.title}» کافی نیست`,
        message: `موجودی «${book.title}» کافی نیست`,
      })
    }

    const price = Number(book.price)
    if (Number.isNaN(price) || price < 0) {
      throw badRequest('قیمت کتاب نامعتبر است')
    }

    items.push({ title: book.title, price, quantity, bookId: book._id.toString() })
    subtotal += price * quantity
  }

  const shippingCost = SHIPPING_COST[shipping]
  return {
    items,
    subtotal,
    shippingCost,
    amount: subtotal + shippingCost,
    shippingMethod: shipping,
  }
}
