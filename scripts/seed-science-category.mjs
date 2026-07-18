/**
 * دسته science را به collection categories اضافه می‌کند (اگر نباشد).
 * node scripts/seed-science-category.mjs
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

const CategorySchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  icon: { type: String, default: '/images/NonFictionIcon(1).svg' },
})

const BookSchema = new mongoose.Schema({}, { strict: false })

const SCIENCE_CATEGORY = {
  slug: 'science',
  name: 'علوم',
  icon: '/images/NonFictionIcon(5).svg',
}

const uri = loadMongoUri()
await mongoose.connect(uri)

const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema)
const Book = mongoose.models.Book || mongoose.model('Book', BookSchema)

const existing = await Category.findOne({ slug: 'science' })
if (existing) {
  console.log('ℹ️  دسته science از قبل وجود دارد:', existing.name)
} else {
  await Category.create(SCIENCE_CATEGORY)
  console.log('✅ دسته science اضافه شد:', SCIENCE_CATEGORY.name)
}

const bookCount = await Book.countDocuments({ category: 'science' })
console.log(`📚 تعداد کتاب‌های science: ${bookCount}`)

const allCategories = await Category.find().lean()
console.log('\nهمه دسته‌ها:')
for (const cat of allCategories) {
  const items = await Book.countDocuments({ category: cat.slug })
  console.log(`  - ${cat.slug} (${cat.name}): ${items} کتاب`)
}

await mongoose.disconnect()
console.log('\nDone.')
