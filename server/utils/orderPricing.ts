import { createError } from 'h3'
import mongoose from 'mongoose'
import { Book } from '../models/Book'
import type { IOrderItem } from '../models/Order'

export const SHIPPING_COST = {
  courier: 45_000,
  pickup: 0,
} as const

export type ShippingMethod = keyof typeof SHIPPING_COST

function asShippingMethod(value: unknown): ShippingMethod {
  return value === 'pickup' ? 'pickup' : 'courier'
}

export async function buildOrderFromItems(rawItems: unknown, shippingMethod: unknown) {
  if (!Array.isArray(rawItems) || rawItems.length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'سبد خرید خالی است' })
  }

  const shipping = asShippingMethod(shippingMethod)
  const qtyByBook = new Map<string, number>()

  for (const row of rawItems) {
    const rec = row && typeof row === 'object' ? (row as Record<string, unknown>) : {}
    const bookId = String(rec.bookId ?? rec.id ?? '').trim()
    const quantity = Number(rec.quantity)

    if (!mongoose.isValidObjectId(bookId) || !Number.isInteger(quantity) || quantity < 1) {
      throw createError({ statusCode: 400, statusMessage: 'آیتم سفارش نامعتبر است' })
    }

    qtyByBook.set(bookId, (qtyByBook.get(bookId) || 0) + quantity)
  }

  const ids = [...qtyByBook.keys()]
  const books = await Book.find({ _id: { $in: ids } }).lean()
  if (books.length !== ids.length) {
    throw createError({ statusCode: 400, statusMessage: 'یکی از کتاب‌ها پیدا نشد' })
  }

  const items: IOrderItem[] = []
  let subtotal = 0

  for (const book of books) {
    const id = book._id.toString()
    const quantity = qtyByBook.get(id) ?? 0
    const stock = book.stock ?? 0
    if (stock < quantity) {
      throw createError({
        statusCode: 409,
        statusMessage: `موجودی «${book.title}» کافی نیست`,
      })
    }

    const price = Number(book.price)
    if (Number.isNaN(price) || price < 0) {
      throw createError({ statusCode: 400, statusMessage: 'قیمت کتاب نامعتبر است' })
    }

    items.push({ title: book.title, price, quantity, bookId: id })
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
