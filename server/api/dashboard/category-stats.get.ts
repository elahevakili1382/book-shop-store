import { defineEventHandler, createError } from 'h3'
import { connectDB } from '../../utils/mongodb'
import { Order } from '../../models/Order'
import { Book } from '../../models/Book'
import { requireAdmin } from '../../utils/requireAuth'

const PAID_STATUSES = ['paid', 'shipped'] as const

export default defineEventHandler(async (event) => {
  requireAdmin(event)
  try {
    await connectDB()

    // get all unique book slugs/categories from Books collection
    const books = await Book.find().select('slug title category').lean()
    const bookCategoryMap = new Map<string, string>()
    for (const b of books) {
      if (b.slug) bookCategoryMap.set(b.slug, b.category || 'سایر')
      // also map by _id string in case items use bookId as ObjectId string
      bookCategoryMap.set((b._id as string).toString(), b.category || 'سایر')
    }

    // get all paid order items
    const orders = await Order.find(
      { status: { $in: [...PAID_STATUSES] } },
      { items: 1, amount: 1 }
    ).lean()

    // tally revenue per category from order items
    const categoryRevenue = new Map<string, number>()
    const categoryCount = new Map<string, number>()

    for (const order of orders) {
      if (!order.items) continue
      for (const item of order.items) {
        let category = 'سایر'
        if (item.bookId && bookCategoryMap.has(item.bookId)) {
          category = bookCategoryMap.get(item.bookId)!
        } else {
          // try matching by title
          for (const [key, cat] of bookCategoryMap.entries()) {
            const book = books.find((b) => b.slug === key || (b._id as string).toString() === key)
            if (book && book.title === item.title) {
              category = cat
              break
            }
          }
        }
        const revenue = (item.price || 0) * (item.quantity || 1)
        categoryRevenue.set(category, (categoryRevenue.get(category) || 0) + revenue)
        categoryCount.set(category, (categoryCount.get(category) || 0) + (item.quantity || 1))
      }
    }

    // sort by revenue descending and take top 8
    const sorted = [...categoryRevenue.entries()]
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8)

    const categories = sorted.map(([c]) => c)
    const series = sorted.map(([, r]) => r)
    const counts = sorted.map(([c]) => categoryCount.get(c) || 0)

    const totalRevenue = series.reduce((s, v) => s + v, 0)

    return { categories, series, counts, totalRevenue }
  } catch (err: any) {
    if (err?.statusCode) throw err
    throw createError({
      statusCode: 500,
      statusMessage: 'خطا در دریافت آمار دسته‌بندی',
    })
  }
})