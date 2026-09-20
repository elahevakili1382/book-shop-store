import type { H3Event } from 'h3'
import { getRouterParam } from 'h3'
import mongoose from 'mongoose'
import { Book, type IBook } from '../models/Book'
import { slugify } from './slugify'

export type LeanBook = IBook & { _id: mongoose.Types.ObjectId }

export function getBookRouteParam(event: H3Event): string {
  const params = event.context.params ?? {}
  let raw =
    params.slug ||
    params.id ||
    getRouterParam(event, 'slug') ||
    getRouterParam(event, 'id') ||
    ''

  if (!raw) {
    const parts = (event.path || '').split('?')[0]?.split('/').filter(Boolean) ?? []
    const booksIdx = parts.indexOf('books')
    const next = booksIdx >= 0 ? parts[booksIdx + 1] : undefined
    if (next && next !== 'reviews') raw = next
  }

  try {
    return decodeURIComponent(String(raw)).trim()
  } catch {
    return String(raw).trim()
  }
}

export function bookPublicSlug(book: {
  slug?: string
  titleEn?: string
  title?: string
  _id?: unknown
}): string {
  const slug = book.slug?.trim()
  if (slug) return slug.toLowerCase()
  const fromEn = slugify(book.titleEn || '')
  if (fromEn) return fromEn
  const fromTitle = slugify(book.title || '')
  if (fromTitle) return fromTitle
  return String(book._id ?? '')
}

export function openLibraryCover(isbn: string, size: 'M' | 'L' = 'L'): string {
  return `https://covers.openlibrary.org/b/isbn/${isbn}-${size}.jpg`
}

export function bookCoverUrl(book: { image?: string; isbn?: string }): string {
  const image = book.image || ''
  const brokenLocal =
    !image ||
    image.includes('NonFiction') ||
    image.includes('default-book') ||
    image.startsWith('/images/books/')

  if (book.isbn && (brokenLocal || image.startsWith('/images/'))) {
    return openLibraryCover(book.isbn)
  }
  return image || '/images/default-book.jpg'
}

export function serializeBook(book: LeanBook) {
  return {
    ...book,
    _id: book._id.toString(),
    id: book._id.toString(),
    slug: bookPublicSlug(book),
    image: bookCoverUrl(book),
    quantity: book.stock,
  }
}

export async function findBookByParam(param: string): Promise<LeanBook | null> {
  if (!param) return null

  const decoded = param
  const lower = decoded.toLowerCase()

  if (/^[a-f0-9]{24}$/i.test(decoded)) {
    const byId = await Book.findById(decoded).lean()
    if (byId) return byId as LeanBook
  }

  const bySlug = await Book.findOne({ slug: lower }).lean()
  if (bySlug) return bySlug as LeanBook

  const byTitleEn = await Book.findOne({
    titleEn: new RegExp(`^${escapeRegex(decoded)}$`, 'i'),
  }).lean()
  if (byTitleEn) return byTitleEn as LeanBook

  const all = (await Book.find().lean()) as LeanBook[]
  return (
    all.find((b) => bookPublicSlug(b) === lower) ||
    all.find((b) => slugify(b.titleEn || '') === lower) ||
    all.find((b) => slugify(b.title || '') === lower) ||
    all.find((b) => (b.titleEn || '').toLowerCase() === lower) ||
    all.find((b) => b.title === decoded) ||
    null
  )
}

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
