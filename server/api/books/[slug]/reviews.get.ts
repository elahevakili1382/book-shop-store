import { defineEventHandler, createError } from 'h3'
import { connectDB } from '../../../utils/mongodb'
import { Review } from '../../../models/Review'
import { bookPublicSlug, findBookByParam, getBookRouteParam } from '../../../utils/bookLookup'

export default defineEventHandler(async (event) => {
  await connectDB()

  const param = getBookRouteParam(event)
  if (!param) {
    throw createError({ statusCode: 400, statusMessage: 'Book slug is required' })
  }

  const book = await findBookByParam(param)
  if (!book) {
    throw createError({ statusCode: 404, statusMessage: 'Book not found' })
  }

  const bookSlug = bookPublicSlug(book)

  const reviews = await Review.find({ bookSlug })
    .sort({ createdAt: -1 })
    .limit(20)
    .lean()

  const stats = await Review.aggregate<{ count: number; averageRating: number }>([
    { $match: { bookSlug } },
    {
      $group: {
        _id: null,
        count: { $sum: 1 },
        averageRating: { $avg: '$rating' },
      },
    },
  ])

  const total = stats[0]?.count ?? 0
  const averageRating = stats[0]?.averageRating
    ? Math.round(stats[0].averageRating * 10) / 10
    : 0

  return {
    bookSlug,
    total,
    averageRating,
    reviews: reviews.map((r) => ({
      id: r._id.toString(),
      bookSlug: r.bookSlug,
      authorName: r.authorName,
      rating: r.rating,
      comment: r.comment,
      createdAt: r.createdAt?.toISOString?.() ?? new Date().toISOString(),
    })),
  }
})
