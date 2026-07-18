/**
 * یک‌بار اجرا کن تا مسیر image همه کتاب‌ها در MongoDB به فایل‌های محلی تنظیم شود:
 * node scripts/sync-local-covers.mjs
 */
import mongoose from 'mongoose'
import { readFileSync, existsSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

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

const LOCAL_BOOK_IMAGES = {
  'Clean Code': '/images/books/clean-code.jpg',
  'JavaScript: The Good Parts': '/images/books/javascript-good-parts.jpg',
  'Atomic Habits': '/images/books/atomic-habits.jpg',
  'The Pragmatic Programmer': '/images/books/pragmatic-programmer.jpg',
  'Design Patterns': '/images/books/design-patterns.jpg',
  "You Don't Know JS": '/images/books/you-dont-know-js.jpg',
  'Deep Work': '/images/books/deep-work.jpg',
  'The 7 Habits of Highly Effective People': '/images/books/seven-habits.jpg',
  'Mindset': '/images/books/mindset.jpg',
  '1984': '/images/books/1984.jpg',
  'The Alchemist': '/images/books/the-alchemist.jpg',
  'To Kill a Mockingbird': '/images/books/to-kill-a-mockingbird.jpg',
  'The Kite Runner': '/images/books/kite-runner.jpg',
  'Sapiens': '/images/books/sapiens.jpg',
  'Guns, Germs, and Steel': '/images/books/guns-germs-steel.jpg',
  'The Silk Roads': '/images/books/silk-roads.jpg',
  "Charlotte's Web": '/images/books/charlottes-web.jpg',
  "Harry Potter and the Sorcerer's Stone": '/images/books/harry-potter.jpg',
  'A Brief History of Time': '/images/books/brief-history-of-time.jpg',
  'The Selfish Gene': '/images/books/selfish-gene.jpg',
}

const BookSchema = new mongoose.Schema(
  {
    title: String,
    image: String,
    price: Number,
    category: String,
  },
  { strict: false }
)

const uri = loadMongoUri()
await mongoose.connect(uri)
const Book = mongoose.models.Book || mongoose.model('Book', BookSchema)

let updated = 0
for (const [title, image] of Object.entries(LOCAL_BOOK_IMAGES)) {
  const filePath = resolve(root, 'public', image.replace(/^\//, ''))
  if (!existsSync(filePath)) {
    console.warn(`⚠️  فایل نیست: ${image} (${title})`)
    continue
  }
  const res = await Book.updateOne({ title }, { $set: { image } })
  if (res.modifiedCount) updated++
  console.log(`${res.matchedCount ? '✅' : '❌'} ${title} → ${image}`)
}

console.log(`\nDone. ${updated} books updated.`)
await mongoose.disconnect()
