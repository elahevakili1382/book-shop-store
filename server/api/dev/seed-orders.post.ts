import { defineEventHandler, createError } from 'h3'
import { connectDB } from '../../utils/mongodb'
import { Order } from '../../models/Order'

/** فقط برای دمو / رزومه — چند سفارش نمونه در Mongo */
export default defineEventHandler(async () => {
  try {
    await connectDB()

    const count = await Order.countDocuments()
    if (count > 0) {
      return { ok: true, inserted: 0, message: 'Orders already exist', total: count }
    }

    const samples = [
      {
        customerName: 'سارا محمدی',
        phone: '09121234567',
        city: 'تهران',
        postalCode: '1234567890',
        address: 'خیابان ولیعصر',
        amount: 450000,
        paymentMethod: 'online' as const,
        status: 'paid' as const,
        items: [{ title: 'کتاب نمونه ۱', price: 225000, quantity: 2 }],
      },
      {
        customerName: 'علی رضایی',
        phone: '09129876543',
        city: 'اصفهان',
        postalCode: '0987654321',
        address: 'خیابان چهارباغ',
        amount: 220000,
        paymentMethod: 'cod' as const,
        status: 'pending' as const,
        items: [{ title: 'کتاب نمونه ۲', price: 220000, quantity: 1 }],
      },
      {
        customerName: 'مریم احمدی',
        phone: '09351112233',
        city: 'شیراز',
        postalCode: '1122334455',
        address: 'بلوار زند',
        amount: 780000,
        paymentMethod: 'online' as const,
        status: 'shipped' as const,
        items: [
          { title: 'کتاب نمونه ۳', price: 390000, quantity: 1 },
          { title: 'کتاب نمونه ۴', price: 390000, quantity: 1 },
        ],
      },
    ]

    await Order.insertMany(samples)

    return { ok: true, inserted: samples.length, total: samples.length }
  } catch (error) {
    console.log('POST /api/dev/seed-orders failed:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to seed orders',
    })
  }
})
