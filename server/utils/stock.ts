import { createError } from 'h3'
import mongoose from 'mongoose'
import { Book } from '../models/Book'

type StockLine = { bookId?: string; quantity: number }

export async function decrementStockForItems(items: StockLine[]) {
  const applied: { id: string; quantity: number }[] = []

  try {
    for (const item of items) {
      const id = item.bookId
      const qty = Number(item.quantity)
      if (!id || !mongoose.isValidObjectId(id) || !Number.isInteger(qty) || qty < 1) {
        continue
      }

      const updated = await Book.findOneAndUpdate(
        { _id: id, stock: { $gte: qty } },
        { $inc: { stock: -qty } },
        { new: true }
      )

      if (!updated) {
        throw createError({
          statusCode: 409,
          statusMessage: 'موجودی کافی نیست',
        })
      }

      applied.push({ id, quantity: qty })
    }
  } catch (err) {
    for (const row of applied.reverse()) {
      await Book.updateOne({ _id: row.id }, { $inc: { stock: row.quantity } })
    }
    throw err
  }
}
