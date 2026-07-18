import { defineEventHandler, createError, getRouterParam } from 'h3'
import mongoose from 'mongoose'
import { connectDB } from '../../../utils/mongodb'
import { Book } from '../../../models/Book'
import { Review } from '../../../models/Review'
import { slugify } from '../../../utils/slugify'

async function resolveBookSlug(param: string): Promise<string | null> {
  if (mongoose.isValidObjectId(param)) {
    const byId = await Book.findById(param).lean()
    if (byId?.slug) return byId.slug.toLowerCase()
    if (byId?.title) return slugify(byId.title)
  }

  const bySlug = await Book.findOne({ slug: param.toLowerCase() }).lean()
  if (bySlug?.slug) return bySlug.slug.toLowerCase()

  const all = await Book.find().lean()
  const match =
    all.find((b) => b.slug?.toLowerCase() === param.toLowerCase()) ??
    all.find((b) => slugify(b.title) === param.toLowerCase())

  return match?.slug?.toLowerCase() ?? (match ? slugify(match.title) : null)
}

export default defineEventHandler(async (event) => {
  await connectDB()

  const param = getRouterParam(event, 'slug')
  if (!param) {
    throw createError({ statusCode: 400, statusMessage: 'Book slug is required' })
  }

  const bookSlug = await resolveBookSlug(param)
  if (!bookSlug) {
    throw createError({ statusCode: 404, statusMessage: 'Book not found' })
  }

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
