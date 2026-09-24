import { defineEventHandler, createError, getQuery } from 'h3'
import mongoose from 'mongoose'
import { connectDB } from '../../utils/mongodb'
import { Book } from '../../models/Book'
import { Category } from '../../models/Category'
import { serializeBook, type LeanBook } from '../../utils/bookLookup'

const LIST_FIELDS = 'title titleEn price image slug rating stock category author isbn publishedYear'

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export default defineEventHandler(async (event) => {
  try {
    await connectDB()

    const query = getQuery(event)
    const category = typeof query.category === 'string' ? query.category : undefined
    const exclude = typeof query.exclude === 'string' ? query.exclude : undefined
    const search = typeof query.q === 'string' ? query.q.trim() : ''
    const full = String(query.full || '') === '1'
    const catalog = String(query.catalog || '') === '1'
    const idsRaw = typeof query.ids === 'string' ? query.ids : ''
    const ids = idsRaw
      .split(',')
      .map((id) => id.trim())
      .filter((id) => mongoose.isValidObjectId(id))
      .slice(0, 40)

    const maxLimit = full || catalog ? 200 : 80
    const limitRaw = query.limit
    const parsedLimit =
      typeof limitRaw === 'string' && /^\d+$/.test(limitRaw)
        ? Math.min(parseInt(limitRaw, 10), maxLimit)
        : undefined
    const limit = parsedLimit ?? (ids.length ? ids.length : full ? 80 : 48)

    const filter: Record<string, unknown> = {}
    if (ids.length) {
      filter._id = { $in: ids.map((id) => new mongoose.Types.ObjectId(id)) }
    } else if (exclude && mongoose.isValidObjectId(exclude)) {
      filter._id = { $ne: new mongoose.Types.ObjectId(exclude) }
    }
    if (category) filter.category = category
    if (search) {
      const rx = new RegExp(escapeRegex(search), 'i')
      const matchedCategories = await Category.find({ name: rx }).select('slug').lean()
      const categorySlugs = matchedCategories.map((cat) => cat.slug).filter(Boolean)
      filter.$or = [
        { title: rx },
        { titleEn: rx },
        { author: rx },
        ...(categorySlugs.length ? [{ category: { $in: categorySlugs } }] : []),
      ]
    }

    let cursor = Book.find(filter).sort({ createdAt: -1 }).limit(limit).lean()
    if (!full) cursor = cursor.select(LIST_FIELDS)

    const books = (await cursor) as LeanBook[]
    return books.map(serializeBook)
  } catch (error) {
    console.log('GET /api/books failed:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch books',
    })
  }
})
