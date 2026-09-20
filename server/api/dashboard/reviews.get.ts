import { defineEventHandler, createError } from 'h3'
import { connectDB } from '../../utils/mongodb'
import { Review } from '../../models/Review'
import { Book } from '../../models/Book'
import { requireAdmin } from '../../utils/requireAuth'

export default defineEventHandler(async (event) => {
  requireAdmin(event)
  try {
    await connectDB()

    const totalCount = await Review.countDocuments()

    const reviews = await Review.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .lean()

    // enrich each review with the book title
    const enriched = await Promise.all(
      reviews.map(async (r) => {
        const book = r.bookSlug
          ? await Book.findOne({ slug: r.bookSlug }).select('title').lean()
          : null
        return {
          id: (r._id as string).toString(),
          bookSlug: r.bookSlug,
          bookTitle: book?.title ?? r.bookSlug,
          authorName: r.authorName,
          rating: r.rating,
          comment: r.comment.slice(0, 200),
          createdAt: r.createdAt?.toISOString?.() ?? new Date().toISOString(),
        }
      })
    )

    return { reviews: enriched, totalCount }
  } catch (err: any) {
    if (err?.statusCode) throw err
    throw createError({
      statusCode: 500,
      statusMessage: 'خطا در دریافت نظرات',
    })
  }
})