import { defineEventHandler, createError } from 'h3'
import { connectDB } from '../../utils/mongodb'
import { Order } from '../../models/Order'
import { requireAuth } from '../../utils/requireAuth'

export default defineEventHandler(async (event) => {
  try {
    const session = requireAuth(event)
    await connectDB()

    const orders = await Order.find({ userId: session.id }).sort({ createdAt: -1 }).limit(50).lean()

    return {
      ok: true,
      orders: orders.map((order) => ({
        ...order,
        _id: order._id.toString(),
        id: order._id.toString(),
      })),
    }
  } catch (err: any) {
    if (err?.statusCode) throw err
    throw createError({
      statusCode: 500,
      statusMessage: 'سفارش‌ها نیامد',
    })
  }
})
