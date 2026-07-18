import { connectDB } from '../../utils/mongodb'
import { Book } from '../../models/Book'
import { LOCAL_BOOK_IMAGES } from '../../data/localBookImages'

/** image همه کتاب‌ها را به مسیر محلی public/images/books/ تغییر می‌دهد */
export default defineEventHandler(async () => {
  await connectDB()

  const results = []

  for (const [title, image] of Object.entries(LOCAL_BOOK_IMAGES)) {
    const res = await Book.updateOne({ title }, { $set: { image } })
    results.push({
      title,
      image,
      matched: res.matchedCount,
      modified: res.modifiedCount,
    })
  }

  return {
    ok: true,
    message: 'Local book cover paths synced to MongoDB',
    updated: results.filter((r) => r.modified > 0).length,
    results,
  }
})
