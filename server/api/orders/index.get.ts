import { defineEventHandler, createError, getQuery } from 'h3'
import { connectDB } from '../../utils/mongodb'
import { Order } from '../../models/Order'

export default defineEventHandler(async (event) => {
  try {
    await connectDB()

    const query = getQuery(event)
    const limitRaw = query.limit
    const limit =
      typeof limitRaw === 'string' && /^\d+$/.test(limitRaw)
        ? Math.min(parseInt(limitRaw, 10), 50)
        : 10

    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean()

    return orders.map((order) => ({
      ...order,
      _id: order._id.toString(),
      id: order._id.toString(),
    }))
  } catch (error) {
    console.log('GET /api/orders failed:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch orders',
    })
  }
})
