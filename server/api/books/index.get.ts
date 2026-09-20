import { defineEventHandler, createError, getQuery } from 'h3'
import mongoose from 'mongoose'
import { connectDB } from '../../utils/mongodb'
import { Book } from '../../models/Book'
import { ensureBookCatalog } from '../../utils/ensureBookCatalog'
import { serializeBook, type LeanBook } from '../../utils/bookLookup'

export default defineEventHandler(async (event) => {
  try {
    await connectDB()
    await ensureBookCatalog()

    const query = getQuery(event)
    const category = typeof query.category === 'string' ? query.category : undefined
    const exclude = typeof query.exclude === 'string' ? query.exclude : undefined
    const limitRaw = query.limit
    const limit =
      typeof limitRaw === 'string' && /^\d+$/.test(limitRaw)
        ? Math.min(parseInt(limitRaw, 10), 50)
        : undefined

    const filter: Record<string, unknown> = {}
    if (category) filter.category = category
    if (exclude && mongoose.isValidObjectId(exclude)) {
      filter._id = { $ne: new mongoose.Types.ObjectId(exclude) }
    }

    let cursor = Book.find(filter).sort({ createdAt: -1 })
    if (limit) cursor = cursor.limit(limit)

    const books = (await cursor.lean()) as LeanBook[]

    return books.map(serializeBook)
    
  } catch (error) {
    console.log('GET /api/books failed:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch books',
    })
  }
})
