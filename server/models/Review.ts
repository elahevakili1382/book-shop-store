import mongoose, { type Model } from 'mongoose'

export interface IReview {
  bookSlug: string
  authorName: string
  rating: number
  comment: string
  createdAt?: Date
}

const ReviewSchema = new mongoose.Schema<IReview>(
  {
    bookSlug: {
      type: String,
      required: true,
      index: true,
      trim: true,
      lowercase: true,
    },
    authorName: {
      type: String,
      required: true,
      trim: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1200,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: false }
)

ReviewSchema.index({ bookSlug: 1, createdAt: -1 })

export const Review: Model<IReview> =
  (mongoose.models.Review as Model<IReview> | undefined) ??
  mongoose.model<IReview>('Review', ReviewSchema)
