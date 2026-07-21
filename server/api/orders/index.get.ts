import {defineEventHandler , createError, getQuery} from 'h3'
import {connectDB} from '../../utils/mongodb'
import {Order} from '../../models/Order'
import {requireAuth} from '../../utils/requireAuth'

export default defineEventHandler(async (event) => {
  try{
  await connectDB()
      requireAuth(event)
  
        const query = getQuery(event)
        const limitRaw = query.limit
        const limit = typeof limitRaw === 'string' && /^\d+$/.test(limitRaw) ? Math.min(parseInt(limitRaw,10),200): 10
  const orders = await Order.find().sort({createdAt:-1}).limit(limit).lean()
  return orders.map((order) =>({
    ...order,
    _id:order._id.toString(),
    id:order._id.toString(),

  }))

  } catch{
    throw createError({
      statusMessage: 'سفارش ها نیامد',
      statusCode:500
    })
  }
})