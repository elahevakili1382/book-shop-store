import mongoose, { type Model } from 'mongoose'

export interface IBook {
  title: string
  titleEn?: string
  description: string
  price: number
  image: string
  category: string
  stock: number
  author?: string
  rating?: number
  reviewCount?: number
  pages?: number
  publisher?: string
  slug?: string
  format?: string
  publishedYear?: number
  translator?: string
  isbn?: string
}

const BookSchema = new mongoose.Schema<IBook>(
  {
    title: {
      type: String,
      required: true,
    },
    titleEn: {
      type: String,
    },
    description: {
      type: String,
      default: '',
    },
    price: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      default: '/images/default-book.jpg',
    },
    category: {
      type: String,
      default: 'عمومی',
    },
    stock: {
      type: Number,
      default: 0,
    },
    author: {
      type: String,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      min: 0,
    },
    pages: {
      type: Number,
      min: 0,
    },
    publisher: {
      type: String,
    },
    slug: {
      type: String,
      index: true,
    },
    format: {
      type: String,
    },
    publishedYear: {
      type: Number,
    },
    translator: {
      type: String,
    },
    isbn: {
      type: String,
    },
  },
  { timestamps: true }
)

export const Book: Model<IBook> =
  (mongoose.models.Book as Model<IBook> | undefined) ??
  mongoose.model<IBook>('Book', BookSchema)
