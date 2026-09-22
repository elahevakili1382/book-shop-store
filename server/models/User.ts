import mongoose, { type Model } from 'mongoose'

export type UserRole = 'user' | 'admin' | 'super-admin'

export interface IUser {
  name: string
  email: string
  password: string
  role: UserRole
  phone?: string
  address?: string
  city?: string
  postalCode?: string
  province?: string
  resetPasswordToken?: string
  resetPasswordExpires?: Date
}

const UserSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['user', 'admin', 'super-admin'],
      default: 'user',
    },
    phone: {
      type: String,
      default: '',
      trim: true,
      index: true,
    },
    address: {
      type: String,
      default: '',
      trim: true,
    },
    city: {
      type: String,
      default: '',
      trim: true,
    },
    province: {
      type: String,
      default: '',
      trim: true,
    },
    postalCode: {
      type: String,
      default: '',
      trim: true,
    },
    resetPasswordToken: {
      type: String,
      default: '',
      index: true,
    },
    resetPasswordExpires: {
      type: Date,
    },
  },
  { timestamps: true }
)

export const User: Model<IUser> =
  (mongoose.models.User as Model<IUser> | undefined) ??
  mongoose.model<IUser>('User', UserSchema)
