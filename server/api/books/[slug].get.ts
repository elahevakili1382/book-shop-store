import { defineEventHandler, createError, getRouterParam } from 'h3'
import mongoose from 'mongoose'
import { connectDB } from '../../utils/mongodb'
import { Book, type IBook } from '../../models/Book'
import { slugify } from '../../utils/slugify'

type LeanBook = IBook & { _id: mongoose.Types.ObjectId }

function serializeBook(book: LeanBook) {
  return {
    ...book,
    _id: book._id.toString(),
    id: book._id.toString(),
  }
}

export default defineEventHandler(async (event) => {
  await connectDB()

  const param = getRouterParam(event, 'slug')

  if (!param) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Book slug is required',
    })
  }

  let book: LeanBook | null = null

  if (mongoose.isValidObjectId(param)) {
    book = (await Book.findById(param).lean()) as LeanBook | null
  }

  if (!book) {
    book = (await Book.findOne({ slug: param.toLowerCase() }).lean()) as LeanBook | null
  }

  if (!book) {
    const all = (await Book.find().lean()) as LeanBook[]
    book =
        all.find((b) => slugify(b.title) === param.toLowerCase()) ??
        all.find((b) => b.slug && slugify(b.slug) === param.toLowerCase()) ??
      null
  }

  if (!book) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Book not found',
    })
  }

  return serializeBook(book)
})
