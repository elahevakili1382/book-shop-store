import mongoose, { type Model } from 'mongoose'

export type PaymentMethod = 'online' | 'cod'
export type OrderStatus = 'pending' | 'paid' | 'failed' | 'shipped'

export interface IOrderItem {
  title: string
  price: number
  quantity: number
  bookId?: string
}

export interface IOrder {
  customerName: string
  phone: string
  address?: string
  city?: string
  postalCode?: string
  amount: number
  paymentMethod: PaymentMethod
  status: OrderStatus
  authority?: string
  items: IOrderItem[]
}

const OrderItemSchema = new mongoose.Schema<IOrderItem>(
  {
    title: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, default: 1 },
    bookId: { type: String },
  },
  { _id: false }
)

const OrderSchema = new mongoose.Schema<IOrder>(
  {
    customerName: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      default: '',
    },
    city: {
      type: String,
      default: '',
    },
    postalCode: {
      type: String,
      default: '',
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentMethod: {
      type: String,
      enum: ['online', 'cod'],
      default: 'online',
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'shipped'],
      default: 'pending',
      index: true,
    },
    authority: {
      type: String,
    },
    items: {
      type: [OrderItemSchema],
      default: [],
    },
  },
  { timestamps: true }
)

export const Order: Model<IOrder> =
  (mongoose.models.Order as Model<IOrder> | undefined) ??
  mongoose.model<IOrder>('Order', OrderSchema)
