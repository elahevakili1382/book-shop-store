import { BOOKS_SEED } from '../data/booksSeed'
import { Book } from '../models/Book'
import { openLibraryCover } from './bookLookup'

let appliedVersion = 0
const CATALOG_VERSION = 5

export async function ensureBookCatalog() {
  if (appliedVersion === CATALOG_VERSION) return

  await Book.deleteMany({
    title: /^vue\.js$/i,
    $or: [{ isbn: { $exists: false } }, { isbn: '' }, { isbn: null }],
  })

  for (const seed of BOOKS_SEED) {
    const cover = openLibraryCover(seed.isbn)
    const matches = await Book.find({
      $or: [
        { slug: seed.slug },
        { titleEn: seed.titleEn },
        { title: seed.titleEn },
        { title: seed.title },
      ],
    }).sort({ updatedAt: -1 })

    const patch = {
      slug: seed.slug,
      title: seed.title,
      titleEn: seed.titleEn,
      isbn: seed.isbn,
      image: cover,
      author: seed.author,
      description: seed.description,
      category: seed.category,
      pages: seed.pages,
      publisher: seed.publisher,
      format: seed.format,
      publishedYear: seed.publishedYear,
      translator: seed.translator,
      rating: seed.rating,
      reviewCount: seed.reviewCount,
    }

    if (matches.length === 0) {
      await Book.create({
        ...seed,
        image: cover,
      })
      continue
    }

    const [keep, ...dupes] = matches
    await Book.updateOne({ _id: keep!._id }, { $set: patch })
    if (dupes.length) {
      await Book.deleteMany({ _id: { $in: dupes.map((d) => d._id) } })
    }
  }

  appliedVersion = CATALOG_VERSION
}
