/**
 * ۲۰ کتاب با فیلدهای کامل (slug، نویسنده، امتیاز و ...) را در MongoDB seed می‌کند.
 * node scripts/seed-books.mjs
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

function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/['']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
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
  Mindset: '/images/books/mindset.jpg',
  '1984': '/images/books/1984.jpg',
  'The Alchemist': '/images/books/the-alchemist.jpg',
  'To Kill a Mockingbird': '/images/books/to-kill-a-mockingbird.jpg',
  'The Kite Runner': '/images/books/kite-runner.jpg',
  Sapiens: '/images/books/sapiens.jpg',
  'Guns, Germs, and Steel': '/images/books/guns-germs-steel.jpg',
  'The Silk Roads': '/images/books/silk-roads.jpg',
  "Charlotte's Web": '/images/books/charlottes-web.jpg',
  "Harry Potter and the Sorcerer's Stone": '/images/books/harry-potter.jpg',
  'A Brief History of Time': '/images/books/brief-history-of-time.jpg',
  'The Selfish Gene': '/images/books/selfish-gene.jpg',
}

const ISBN_BY_TITLE = {
  'Clean Code': '9780132350884',
  'JavaScript: The Good Parts': '9780596517748',
  'Atomic Habits': '9780735211292',
  'The Pragmatic Programmer': '9780135957059',
  'Design Patterns': '9780201633610',
  "You Don't Know JS": '9781449335215',
  'Deep Work': '9781455586691',
  'The 7 Habits of Highly Effective People': '9781982137138',
  Mindset: '9780345472328',
  '1984': '9780452284234',
  'The Alchemist': '9780062315007',
  'To Kill a Mockingbird': '9780061120084',
  'The Kite Runner': '9781594631931',
  Sapiens: '9780062316097',
  'Guns, Germs, and Steel': '9780393354324',
  'The Silk Roads': '9781101912373',
  "Charlotte's Web": '9780064400558',
  "Harry Potter and the Sorcerer's Stone": '9780590353427',
  'A Brief History of Time': '9780553380163',
  'The Selfish Gene': '9780198788607',
}

const TITLE_FA = {
  'Clean Code': 'کد تمیز',
  'JavaScript: The Good Parts': 'جاوااسکریپت: بخش‌های خوب',
  'Atomic Habits': 'عادت‌های اتمی',
  'The Pragmatic Programmer': 'برنامه‌نویس عمل‌گرا',
  'Design Patterns': 'الگوهای طراحی',
  "You Don't Know JS": 'تو جاوااسکریپت را نمی‌شناسی',
  'Deep Work': 'کار عمیق',
  'The 7 Habits of Highly Effective People': 'هفت عادت مردمان موثر',
  Mindset: 'ذهنیت',
  '1984': '۱۹۸۴',
  'The Alchemist': 'کیمیاگر',
  'To Kill a Mockingbird': 'کشتن مرغ مقلد',
  'The Kite Runner': 'بادبادک‌باز',
  Sapiens: 'انسان خردمند',
  'Guns, Germs, and Steel': 'تفنگ، میکروب و فولاد',
  'The Silk Roads': 'جاده‌های ابریشم',
  "Charlotte's Web": 'تار عنکبوت',
  "Harry Potter and the Sorcerer's Stone": 'هری پاتر و سنگ جادو',
  'A Brief History of Time': 'تاریخچه مختصر زمان',
  'The Selfish Gene': 'ژن خودخواه',
}

const REVIEW_COUNTS = [128, 94, 312, 76, 58, 103, 187, 245, 91, 421, 356, 278, 203, 389, 112, 67, 154, 892, 176, 89]

const BOOK_META = [
  { author: 'Robert C. Martin', description: 'اصول نوشتن کد تمیز و قابل نگهداری برای توسعه‌دهندگان حرفه‌ای.', price: 485000, category: 'programming', stock: 12, rating: 4.8, pages: 464, publisher: 'Prentice Hall', format: 'جلد شومیز', publishedYear: 2008 },
  { author: 'Douglas Crockford', description: 'راهنمای عملی برای استفاده درست از JavaScript.', price: 320000, category: 'programming', stock: 8, rating: 4.5, pages: 176, publisher: "O'Reilly Media", format: 'جلد شومیز', publishedYear: 2008 },
  { author: 'James Clear', description: 'راهنمای علمی ساخت عادت‌های مثبت.', price: 295000, category: 'psychology', stock: 20, rating: 4.7, pages: 320, publisher: 'Avery', format: 'جلد شومیز', publishedYear: 2018, translator: 'سارا محمدی' },
  { author: 'Andrew Hunt, David Thomas', description: 'مهارت‌های یک برنامه‌نویس حرفه‌ای.', price: 510000, category: 'programming', stock: 6, rating: 4.6, pages: 352, publisher: 'Addison-Wesley', format: 'جلد شومیز', publishedYear: 2019 },
  { author: 'Erich Gamma et al.', description: 'الگوهای طراحی شیءگرا.', price: 620000, category: 'programming', stock: 5, rating: 4.4, pages: 416, publisher: 'Addison-Wesley', format: 'جلد گالینگور', publishedYear: 1994 },
  { author: 'Kyle Simpson', description: 'درک عمیق JavaScript.', price: 380000, category: 'programming', stock: 10, rating: 4.5, pages: 278, publisher: "O'Reilly Media", format: 'جلد شومیز', publishedYear: 2015 },
  { author: 'Cal Newport', description: 'استراتژی‌های تمرکز عمیق.', price: 275000, category: 'psychology', stock: 15, rating: 4.6, pages: 296, publisher: 'Grand Central', format: 'جلد شومیز', publishedYear: 2016, translator: 'نیما رضایی' },
  { author: 'Stephen R. Covey', description: 'هفت عادت بنیادین موفقیت.', price: 340000, category: 'psychology', stock: 18, rating: 4.5, pages: 384, publisher: 'Free Press', format: 'جلد شومیز', publishedYear: 2020, translator: 'مریم احمدی' },
  { author: 'Carol S. Dweck', description: 'تغییر ذهنیت برای رشد.', price: 260000, category: 'psychology', stock: 14, rating: 4.4, pages: 320, publisher: 'Ballantine', format: 'جلد شومیز', publishedYear: 2016 },
  { author: 'George Orwell', description: 'رمان dystopian کلاسیک.', price: 220000, category: 'literature', stock: 22, rating: 4.7, pages: 328, publisher: 'Signet Classic', format: 'جلد شومیز', publishedYear: 1950, translator: 'صادق هدایت' },
  { author: 'Paulo Coelho', description: 'سفر معنوی یک چوپان.', price: 195000, category: 'literature', stock: 25, rating: 4.3, pages: 208, publisher: 'HarperOne', format: 'جلد شومیز', publishedYear: 1988, translator: 'آرش حجازی' },
  { author: 'Harper Lee', description: 'داستان کلاسیک عدالت و بلوغ.', price: 245000, category: 'literature', stock: 11, rating: 4.8, pages: 336, publisher: 'Harper Perennial', format: 'جلد شومیز', publishedYear: 1960, translator: 'فریده مهدوی' },
  { author: 'Khaled Hosseini', description: 'دوستی و redemption در افغانستان.', price: 280000, category: 'literature', stock: 9, rating: 4.6, pages: 371, publisher: 'Riverhead', format: 'جلد شومیز', publishedYear: 2003, translator: 'مهدی غبرایی' },
  { author: 'Yuval Noah Harari', description: 'تاریخچه انسان از عصر سنگ.', price: 420000, category: 'history', stock: 16, rating: 4.7, pages: 443, publisher: 'Harper', format: 'جلد شومیز', publishedYear: 2015, translator: 'کیوان فدایی' },
  { author: 'Jared Diamond', description: 'چرا تمدن‌ها متفاوت رشد کردند.', price: 395000, category: 'history', stock: 7, rating: 4.4, pages: 480, publisher: 'W. W. Norton', format: 'جلد شومیز', publishedYear: 1997 },
  { author: 'Peter Frankopan', description: 'تاریخ جهان از دیدگاه جاده ابریشم.', price: 450000, category: 'history', stock: 6, rating: 4.5, pages: 656, publisher: 'Vintage', format: 'جلد شومیز', publishedYear: 2016, translator: 'پریسا نوری' },
  { author: 'E. B. White', description: 'داستان کلاسیک دوستی برای کودکان.', price: 165000, category: 'children', stock: 30, rating: 4.6, pages: 192, publisher: 'HarperCollins', format: 'مصور', publishedYear: 1952, translator: 'ژاله علام' },
  { author: 'J. K. Rowling', description: 'اولین جلد سری هری پاتر.', price: 310000, category: 'children', stock: 28, rating: 4.9, pages: 309, publisher: 'Scholastic', format: 'جلد شومیز', publishedYear: 1997, translator: 'ویدا اسلامیه' },
  { author: 'Stephen Hawking', description: 'سفر به کیهان و فیزیک مدرن.', price: 360000, category: 'science', stock: 10, rating: 4.5, pages: 256, publisher: 'Bantam', format: 'جلد شومیز', publishedYear: 1988, translator: 'مجتبی واحدی' },
  { author: 'Richard Dawkins', description: 'نگاه تکاملی به ژن‌ها.', price: 330000, category: 'science', stock: 8, rating: 4.4, pages: 360, publisher: 'Oxford University Press', format: 'جلد شومیز', publishedYear: 1976 },
]

const ENGLISH_TITLES = Object.keys(LOCAL_BOOK_IMAGES)

const BOOKS = ENGLISH_TITLES.map((titleEn, i) => {
  const meta = BOOK_META[i]
  return {
    title: TITLE_FA[titleEn] ?? titleEn,
    titleEn,
    slug: slugify(titleEn),
    image: LOCAL_BOOK_IMAGES[titleEn] ?? '/images/default-book.jpg',
    isbn: ISBN_BY_TITLE[titleEn] ?? '',
    reviewCount: REVIEW_COUNTS[i] ?? 0,
    ...meta,
  }
})

const BookSchema = new mongoose.Schema({}, { strict: false })
const uri = loadMongoUri()
await mongoose.connect(uri)
const Book = mongoose.models.Book || mongoose.model('Book', BookSchema)

let created = 0
let updated = 0

for (const book of BOOKS) {
  const res = await Book.updateOne({ slug: book.slug }, { $set: book }, { upsert: true })
  if (res.upsertedCount) created++
  else if (res.modifiedCount) updated++
  console.log(`✅ ${book.title} → /product/${book.slug}`)
}

console.log(`\nDone. ${created} created, ${updated} updated (${BOOKS.length} total).`)
await mongoose.disconnect()
