import { defineEventHandler, createError } from 'h3'
import { connectDB } from '../../utils/mongodb'
import { findBookByParam, getBookRouteParam, serializeBook } from '../../utils/bookLookup'

export default defineEventHandler(async (event) => {
  await connectDB()

  const param = getBookRouteParam(event)
  if (!param) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Book slug is required',
    })
  }

  const book = await findBookByParam(param)
  if (!book) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Book not found',
    })
  }

  return serializeBook(book)
})
