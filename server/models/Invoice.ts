import mongoose, { type Model } from 'mongoose'
export type InvoiceStatus = 'paid' | 'pending' | 'unpaid'


export interface IInvoice {
  orderId: string
  number: string
  customerName: string
  phone?: string
  amount: number
  status: InvoiceStatus
  issuedAt?: Date
  dueAt?: Date
  note?: string
}


const InvoiceSchema = new mongoose.Schema<IInvoice>(
  {
    orderId: {
      type: String,
      required: true,
      trim: true,
    },
    number: {
      type: String,
      required: true,
      trim: true,
    },
    customerName: {
      type: String,
        required: true,
      trim: true,
      
    },
    phone: {
      type: String,
      default: '',
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ['paid', 'pending', 'unpaid'],
      default: 'pending',
      index: true,

    },
    issuedAt: {
      type: Date,
    },
      dueAt: {
      type: Date,
    },
      note: {
      type: String,
    },
   
  },
  { timestamps: true }
)

export const Invoice: Model<IInvoice> =
  (mongoose.models.Invoice as Model<IInvoice> | undefined) ??
  mongoose.model<IInvoice>('Invoice', InvoiceSchema)
