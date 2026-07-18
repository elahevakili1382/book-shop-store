/**
 * نظرات را از server/data/reviewsSeed.ts می‌خواند و در MongoDB می‌ریزد.
 *
 * فقط reviewsSeed.ts را ویرایش کن، بعد:
 *   npm run seed-reviews
 */
import mongoose from 'mongoose'
import { readFileSync, existsSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { createJiti } from 'jiti'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')

function loadMongoUri() {
  const envPath = resolve(root, '.env')
  if (!existsSync(envPath)) throw new Error('.env not found')
  const env = readFileSync(envPath, 'utf8')
  const line = env.split('\n').find((l) => /^\s*MONGODB_(URI|URL)=/.test(l))
  if (!line) throw new Error('MONGODB_URI or MONGODB_URL missing in .env')
  return line.split('=').slice(1).join('=').trim().replace(/^["']|["']$/g, '')
}

const jiti = createJiti(import.meta.url)
const { REVIEWS_SEED } = await jiti.import(`${root}/server/data/reviewsSeed.ts`)

const ReviewSchema = new mongoose.Schema({}, { strict: false })
const BookSchema = new mongoose.Schema({}, { strict: false })

const uri = loadMongoUri()
await mongoose.connect(uri)

const Review = mongoose.models.Review || mongoose.model('Review', ReviewSchema)
const Book = mongoose.models.Book || mongoose.model('Book', BookSchema)

await Review.deleteMany({})

let inserted = 0
const now = Date.now()

for (const entry of REVIEWS_SEED) {
  const createdAt = new Date(now - (entry.daysAgo ?? 0) * 24 * 60 * 60 * 1000)
  await Review.create({
    bookSlug: entry.bookSlug,
    authorName: entry.authorName,
    rating: entry.rating,
    comment: entry.comment,
    createdAt,
  })
  inserted++
}

const slugs = [...new Set(REVIEWS_SEED.map((r) => r.bookSlug))]
for (const bookSlug of slugs) {
  const stats = await Review.aggregate([
    { $match: { bookSlug } },
    { $group: { _id: null, count: { $sum: 1 }, avg: { $avg: '$rating' } } },
  ])
  if (stats[0]) {
    await Book.updateOne(
      { slug: bookSlug },
      {
        $set: {
          reviewCount: stats[0].count,
          rating: Math.round(stats[0].avg * 10) / 10,
        },
      }
    )
    console.log(`📊 ${bookSlug}: ${stats[0].count} reviews, avg ${stats[0].avg.toFixed(1)}`)
  }
}

console.log(`\nDone. ${inserted} reviews seeded from reviewsSeed.ts`)
await mongoose.disconnect()
