import { Book } from '../models/Book'
import { slugify } from './slugify'
import { openLibraryCover } from './bookLookup'

type CatalogQuery = {
  category: string
  google: string
  openLibrary: string
  lang?: string
}

type NormalizedBook = {
  title: string
  titleEn?: string
  slug: string
  isbn: string
  image: string
  author: string
  description: string
  category: string
  pages?: number
  publisher?: string
  publishedYear?: number
  rating?: number
  reviewCount?: number
  price: number
  stock: number
  source: 'catalog-api'
}

const QUERIES: CatalogQuery[] = [
  { category: 'programming', google: 'subject:Computer programming', openLibrary: 'subject:computer_programming', lang: 'en' },
  { category: 'psychology', google: 'روانشناسی', openLibrary: 'psychology', lang: 'fa' },
  { category: 'literature', google: 'رمان فارسی', openLibrary: 'persian fiction', lang: 'fa' },
  { category: 'history', google: 'تاریخ ایران', openLibrary: 'iran history', lang: 'fa' },
  { category: 'children', google: 'داستان کودک', openLibrary: 'children stories', lang: 'fa' },
  { category: 'science', google: 'علم', openLibrary: 'science', lang: 'fa' },
]

function stripHtml(value: string) {
  return value.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
}

function hashPrice(key: string) {
  let hash = 0
  for (const char of key) hash = (hash * 33 + char.charCodeAt(0)) >>> 0
  return 165000 + (hash % 40) * 10000
}

function hashStock(key: string) {
  let hash = 0
  for (const char of key) hash = (hash * 17 + char.charCodeAt(0)) >>> 0
  return 4 + (hash % 18)
}

function httpsUrl(url?: string) {
  if (!url) return ''
  return url.replace(/^http:\/\//, 'https://').replace(/zoom=\d+/, 'zoom=1')
}

function yearFrom(value?: string) {
  const match = String(value || '').match(/\d{4}/)
  return match ? Number(match[0]) : undefined
}

async function fetchJson<T>(url: string): Promise<T | null> {
  try {
    return await $fetch<T>(url, { timeout: 8000 })
  } catch {
    return null
  }
}

type GoogleVolume = {
  id?: string
  volumeInfo?: {
    title?: string
    authors?: string[]
    description?: string
    pageCount?: number
    publisher?: string
    publishedDate?: string
    averageRating?: number
    ratingsCount?: number
    imageLinks?: { thumbnail?: string; smallThumbnail?: string }
    industryIdentifiers?: { type?: string; identifier?: string }[]
  }
  saleInfo?: { listPrice?: { amount?: number; currencyCode?: string } }
}

function priceFromSale(isbn: string, list?: { amount?: number; currencyCode?: string }) {
  const amount = Number(list?.amount)
  const code = list?.currencyCode || ''
  if (Number.isFinite(amount) && amount > 0) {
    if (code === 'IRR') return Math.round(amount)
    if (code === 'IRT') return Math.round(amount * 10)
    if (code === 'USD') return Math.round(amount * 90000)
    if (code === 'EUR') return Math.round(amount * 98000)
  }
  return hashPrice(isbn)
}

function fromGoogle(item: GoogleVolume, category: string): NormalizedBook | null {
  const info = item.volumeInfo
  const title = info?.title?.trim()
  if (!title) return null

  const isbn13 = info?.industryIdentifiers?.find((id) => id.type === 'ISBN_13')?.identifier
  const isbn10 = info?.industryIdentifiers?.find((id) => id.type === 'ISBN_10')?.identifier
  const isbn = String(isbn13 || isbn10 || `gb-${item.id || slugify(title)}`).replace(/[^0-9A-Za-z-]/g, '')
  const slug = slugify(title) || isbn.toLowerCase()
  const image =
    httpsUrl(info?.imageLinks?.thumbnail) ||
    httpsUrl(info?.imageLinks?.smallThumbnail) ||
    (isbn13 || isbn10 ? openLibraryCover(isbn13 || isbn10 || '') : '/images/default-book.jpg')

  return {
    title,
    titleEn: title,
    slug,
    isbn,
    image,
    author: (info?.authors || []).slice(0, 3).join(', '),
    description: stripHtml(info?.description || ''),
    category,
    pages: info?.pageCount,
    publisher: info?.publisher,
    publishedYear: yearFrom(info?.publishedDate),
    rating: info?.averageRating,
    reviewCount: info?.ratingsCount,
    price: priceFromSale(isbn, info ? item.saleInfo?.listPrice : undefined),
    stock: hashStock(isbn),
    source: 'catalog-api',
  }
}

type OpenLibraryDoc = {
  title?: string
  author_name?: string[]
  isbn?: string[]
  cover_i?: number
  first_publish_year?: number
  publisher?: string[]
  number_of_pages_median?: number
  ratings_average?: number
  ratings_count?: number
  first_sentence?: string[] | string
}

function fromOpenLibrary(doc: OpenLibraryDoc, category: string): NormalizedBook | null {
  const title = doc.title?.trim()
  if (!title || title.length < 8) return null
  if (!doc.cover_i) return null
  if (/bxs|story books$|children stories$/i.test(title)) return null
  const realIsbn = doc.isbn?.find((value) => /^\d{10,13}$/.test(value.replace(/-/g, '')))
  if (!realIsbn) return null
  const isbn = String(doc.isbn?.find((value) => value.length >= 10) || `ol-${slugify(title)}`)
  const slug = slugify(title) || isbn.toLowerCase()
  const image = doc.cover_i
    ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg`
    : doc.isbn?.[0]
      ? openLibraryCover(doc.isbn[0])
      : '/images/default-book.jpg'
  const sentence = Array.isArray(doc.first_sentence) ? doc.first_sentence[0] : doc.first_sentence

  return {
    title,
    titleEn: title,
    slug,
    isbn,
    image,
    author: (doc.author_name || []).slice(0, 3).join(', '),
    description: sentence || '',
    category,
    pages: doc.number_of_pages_median,
    publisher: doc.publisher?.[0],
    publishedYear: doc.first_publish_year,
    rating: doc.ratings_average ? Math.round(doc.ratings_average * 10) / 10 : undefined,
    reviewCount: doc.ratings_count,
    price: hashPrice(isbn),
    stock: hashStock(isbn),
    source: 'catalog-api',
  }
}

async function fetchCategoryBooks(query: CatalogQuery): Promise<NormalizedBook[]> {
  const googleUrl = new URL('https://www.googleapis.com/books/v1/volumes')
  googleUrl.searchParams.set('q', query.google)
  googleUrl.searchParams.set('maxResults', '10')
  googleUrl.searchParams.set('printType', 'books')
  googleUrl.searchParams.set('orderBy', 'relevance')
  if (query.lang) googleUrl.searchParams.set('langRestrict', query.lang)

  const google = await fetchJson<{ items?: GoogleVolume[] }>(googleUrl.toString())
  const fromApi = (google?.items || [])
    .map((item) => fromGoogle(item, query.category))
    .filter((item): item is NormalizedBook => Boolean(item))

  if (fromApi.length >= 4) return fromApi

  const olUrl = new URL('https://openlibrary.org/search.json')
  olUrl.searchParams.set('q', query.openLibrary)
  olUrl.searchParams.set('limit', '10')
  const openLibrary = await fetchJson<{ docs?: OpenLibraryDoc[] }>(olUrl.toString())
  const fallback = (openLibrary?.docs || [])
    .map((doc) => fromOpenLibrary(doc, query.category))
    .filter((item): item is NormalizedBook => Boolean(item))

  const seen = new Set(fromApi.map((book) => book.isbn))
  for (const book of fallback) {
    if (!seen.has(book.isbn)) fromApi.push(book)
  }
  return fromApi
}

async function upsertCatalogBook(book: NormalizedBook) {
  const existing = await Book.findOne({
    $or: [{ isbn: book.isbn }, { slug: book.slug }],
  })

  if (existing?.source === 'admin') return

  const patch: Record<string, unknown> = {
    title: book.title,
    titleEn: book.titleEn,
    slug: book.slug,
    isbn: book.isbn,
    image: book.image,
    author: book.author,
    description: book.description,
    category: book.category,
    pages: book.pages,
    publisher: book.publisher,
    publishedYear: book.publishedYear,
    rating: book.rating,
    reviewCount: book.reviewCount,
    source: 'catalog-api',
  }

  if (!existing) {
    patch.price = book.price
    patch.stock = book.stock
    await Book.create(patch)
    return
  }

  await Book.updateOne({ _id: existing._id }, { $set: patch })
}

export async function ingestExternalCatalog() {
  const groups = await Promise.all(QUERIES.map((query) => fetchCategoryBooks(query)))
  const books = groups.flat()
  const unique = new Map<string, NormalizedBook>()
  for (const book of books) {
    if (!unique.has(book.isbn)) unique.set(book.isbn, book)
  }

  for (const book of unique.values()) {
    await upsertCatalogBook(book)
  }

  return unique.size
}
