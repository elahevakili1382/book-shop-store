import { defineEventHandler } from 'h3'
import { connectDB } from '../../utils/mongodb'
import { Review } from '../../models/Review'
import { Book } from '../../models/Book'
import { requireAuth } from '../../utils/requireAuth'

export default defineEventHandler(async (event) => {
  const session = requireAuth(event)
  await connectDB()

  const reviews = await Review.find({
    $or: [
      { userId: session.id },
      { authorName: session.name },
    ],
  })
    .sort({ createdAt: -1 })
    .limit(40)
    .lean()

  const slugs = [...new Set(reviews.map((review) => review.bookSlug))]
  const books = await Book.find({ slug: { $in: slugs } }).select('title slug').lean()
  const titles = new Map(books.map((book) => [book.slug, book.title]))

  return {
    ok: true,
    reviews: reviews.map((review) => ({
      id: review._id.toString(),
      bookSlug: review.bookSlug,
      bookTitle: titles.get(review.bookSlug) || review.bookSlug,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt?.toISOString?.() ?? new Date().toISOString(),
    })),
  }
})
