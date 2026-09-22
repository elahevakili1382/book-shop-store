import { defineEventHandler, createError } from 'h3'
import { connectDB } from '../../utils/mongodb'
import { User } from '../../models/User'
import { Order } from '../../models/Order'
import { requireAdmin } from '../../utils/requireAuth'

export default defineEventHandler(async (event) => {
  try {
    requireAdmin(event)
    await connectDB()

    const [users, orders] = await Promise.all([
      User.find().select('-password').sort({ createdAt: -1 }).lean(),
      Order.find({}, { userId: 1, customerName: 1, phone: 1, city: 1, address: 1 })
        .sort({ createdAt: -1 })
        .lean(),
    ])

    return users.map((user) => {
      const id = user._id.toString()
      const fromOrder =
        orders.find((order) => order.userId && order.userId === id)
        || (user.phone && orders.find((order) => order.phone === user.phone))
        || orders.find((order) => order.customerName === user.name)

      return {
        ...user,
        _id: id,
        id,
        phone: user.phone || fromOrder?.phone || '',
        city: user.city || fromOrder?.city || '',
        address: user.address || fromOrder?.address || '',
        province: user.province || '',
      }
    })
  } catch (error: any) {
    if (error?.statusCode) throw error
    console.log('GET /api/users failed:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch users',
    })
  }
})
